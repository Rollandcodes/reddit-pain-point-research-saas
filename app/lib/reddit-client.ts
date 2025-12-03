/**
 * Reddit API client for fetching posts and comments
 * Uses Reddit's OAuth API with rate limiting
 */

interface RedditPost {
  id: string
  title: string
  selftext: string
  subreddit: string
  score: number
  numComments: number
  createdUtc: number
  permalink: string
  author: string
}

interface RedditComment {
  id: string
  body: string
  score: number
  createdUtc: number
  permalink: string
  author: string
}

interface RedditSearchResult {
  posts: RedditPost[]
  comments: RedditComment[]
}

class RateLimiter {
  private queue: Array<() => Promise<void>> = []
  private processing = false
  private requestsPerMinute: number
  private lastRequestTime = 0

  constructor(requestsPerMinute = 30) {
    this.requestsPerMinute = requestsPerMinute
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return
    this.processing = true

    while (this.queue.length > 0) {
      const minInterval = 60000 / this.requestsPerMinute
      const timeSinceLastRequest = Date.now() - this.lastRequestTime
      
      if (timeSinceLastRequest < minInterval) {
        await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest))
      }

      const task = this.queue.shift()
      if (task) {
        this.lastRequestTime = Date.now()
        await task()
      }
    }

    this.processing = false
  }
}

class RedditClient {
  private accessToken: string | null = null
  private tokenExpiry: number = 0
  private rateLimiter = new RateLimiter(30)
  private baseUrl = "https://oauth.reddit.com"

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const clientId = process.env.REDDIT_CLIENT_ID
    const clientSecret = process.env.REDDIT_CLIENT_SECRET
    const userAgent = process.env.REDDIT_USER_AGENT || "PainPointRadar/1.0"

    if (!clientId || !clientSecret) {
      throw new Error("Reddit API credentials not configured")
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    
    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": userAgent,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      throw new Error(`Failed to get Reddit access token: ${response.status}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Refresh 1 min early
    
    return this.accessToken
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    return this.rateLimiter.execute(async () => {
      const token = await this.getAccessToken()
      const userAgent = process.env.REDDIT_USER_AGENT || "PainPointRadar/1.0"
      
      const url = new URL(`${this.baseUrl}${endpoint}`)
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })

      const response = await fetch(url.toString(), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "User-Agent": userAgent,
        },
      })

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`)
      }

      return response.json()
    })
  }

  /**
   * Search for posts matching keywords
   */
  async searchPosts(
    keywords: string,
    options: {
      subreddits?: string[]
      timeRange?: "day" | "week" | "month" | "year" | "all"
      limit?: number
    } = {}
  ): Promise<RedditPost[]> {
    const { subreddits, timeRange = "month", limit = 100 } = options
    const posts: RedditPost[] = []
    
    // Search query - if subreddits specified, search within them
    const subredditPath = subreddits?.length 
      ? `/r/${subreddits.join("+")}/search`
      : "/search"

    try {
      const data = await this.request<any>(subredditPath, {
        q: keywords,
        sort: "relevance",
        t: timeRange,
        limit: String(Math.min(limit, 100)),
        restrict_sr: subreddits?.length ? "true" : "false",
        type: "link",
      })

      for (const child of data.data?.children || []) {
        const post = child.data
        posts.push({
          id: post.id,
          title: post.title || "",
          selftext: post.selftext || "",
          subreddit: post.subreddit,
          score: post.score,
          numComments: post.num_comments,
          createdUtc: post.created_utc,
          permalink: `https://reddit.com${post.permalink}`,
          author: post.author,
        })
      }
    } catch (error) {
      console.error("Error searching Reddit posts:", error)
    }

    return posts
  }

  /**
   * Get comments from a post
   */
  async getPostComments(
    subreddit: string,
    postId: string,
    limit = 50
  ): Promise<RedditComment[]> {
    const comments: RedditComment[] = []

    try {
      const data = await this.request<any[]>(`/r/${subreddit}/comments/${postId}`, {
        limit: String(limit),
        sort: "top",
      })

      // Comments are in the second element of the response array
      const commentData = data[1]?.data?.children || []
      
      const extractComments = (children: any[]) => {
        for (const child of children) {
          if (child.kind === "t1" && child.data.body) {
            comments.push({
              id: child.data.id,
              body: child.data.body,
              score: child.data.score,
              createdUtc: child.data.created_utc,
              permalink: `https://reddit.com${child.data.permalink}`,
              author: child.data.author,
            })
            
            // Recursively get replies
            if (child.data.replies?.data?.children) {
              extractComments(child.data.replies.data.children)
            }
          }
        }
      }

      extractComments(commentData)
    } catch (error) {
      console.error("Error getting post comments:", error)
    }

    return comments.slice(0, limit)
  }

  /**
   * Full search: posts + top comments from each post
   */
  async search(
    keywords: string,
    options: {
      subreddits?: string[]
      timeRange?: "day" | "week" | "month" | "year" | "all"
      maxPosts?: number
      commentsPerPost?: number
    } = {}
  ): Promise<RedditSearchResult> {
    const { 
      subreddits, 
      timeRange = "month", 
      maxPosts = 50,
      commentsPerPost = 20 
    } = options

    // Get posts
    const posts = await this.searchPosts(keywords, {
      subreddits,
      timeRange: this.convertTimeRange(timeRange),
      limit: maxPosts,
    })

    // Get comments from top posts (limit to avoid rate limiting)
    const topPosts = posts.slice(0, Math.min(10, posts.length))
    const allComments: RedditComment[] = []

    for (const post of topPosts) {
      const comments = await this.getPostComments(
        post.subreddit,
        post.id,
        commentsPerPost
      )
      allComments.push(...comments)
    }

    return { posts, comments: allComments }
  }

  private convertTimeRange(days: string): "day" | "week" | "month" | "year" | "all" {
    const d = parseInt(days, 10)
    if (d <= 1) return "day"
    if (d <= 7) return "week"
    if (d <= 30) return "month"
    if (d <= 365) return "year"
    return "all"
  }
}

export const redditClient = new RedditClient()
export type { RedditPost, RedditComment, RedditSearchResult }
