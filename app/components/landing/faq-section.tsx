"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What exactly is a 'scan'?",
    answer: "One scan = one keyword search across unlimited subreddits, analyzing up to 1,000 posts per keyword. For example, searching 'project management tools' across r/productivity, r/SaaS, and r/startups counts as 1 scan. You get AI-clustered pain points, sentiment analysis, opportunity scores, and CSV export for each scan.",
  },
  {
    question: "How are Opportunity Scores calculated?",
    answer: "Opportunity Score (0-100) = (mention frequency × sentiment intensity × urgency keywords × recency). Higher scores = better SaaS opportunities. For example: a pain point mentioned 50+ times, with negative sentiment, urgent language like 'desperately need' or 'struggling', and recent posts gets 85-95. A rare complaint with neutral tone gets 20-40.",
  },
  {
    question: "How long does a scan take?",
    answer: "Most scans complete in 2-5 minutes depending on the volume of posts. We analyze thousands of Reddit discussions in real-time, cluster similar pain points using AI, and generate your report. You'll receive an email notification when it's ready.",
  },
  {
    question: "What subreddits are supported?",
    answer: "PainPointRadar can scan any public subreddit. Popular choices include r/SaaS, r/startups, r/Entrepreneur, r/smallbusiness, r/freelance, and niche communities related to your target market. You can also let our AI automatically discover relevant subreddits based on your keywords.",
  },
  {
    question: "Do you comply with Reddit's Terms of Service?",
    answer: "Yes, absolutely. We use Reddit's official API and respect all rate limits and data usage policies. We only access public posts (never private communities or DMs), attribute content to Reddit, and don't scrape data in violation of their ToS. Your scans are fully compliant.",
  },
  {
    question: "How is this different from manual research?",
    answer: "Manual research means reading hundreds of posts, taking notes, and trying to spot patterns - this takes days or weeks. PainPointRadar analyzes thousands of posts in minutes, automatically clusters similar complaints, scores opportunities, and extracts real quotes. You get the same insights in 1/100th of the time.",
  },
  {
    question: "What's included in a pain point report?",
    answer: "Each report includes: clustered pain points ranked by opportunity score, sentiment analysis, post volume per cluster, real quotes from users, subreddit sources, and an overall market summary. Pro and Premium plans include additional AI-generated insights and recommendations.",
  },
  {
    question: "Is my data stored or shared?",
    answer: "We take privacy seriously. Your scan queries and results are stored only for your access. We never share your data with third parties. Reports are automatically deleted after your retention period (7 days for Free, 30 days for Pro, unlimited for Premium). You can delete your data at any time.",
  },
  {
    question: "Can I export the results?",
    answer: "Yes! All plans include CSV export. Pro and Premium plans also include PDF reports and API access for integrating with your own tools.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us and we'll refund your payment - no questions asked.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Everything you need to know about PainPointRadar
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
