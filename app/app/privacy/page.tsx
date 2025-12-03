import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <div className="container px-4 sm:px-6 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: December 3, 2025
            </p>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                PainPointRadar (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium mt-4 mb-2">Personal Information</h3>
              <p>We may collect personal information that you provide to us, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Email address (when signing up or joining waitlist)</li>
                <li>Name (if provided)</li>
                <li>Payment information (processed securely via Stripe)</li>
                <li>Usage data and preferences</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-2">Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide and maintain our services</li>
                <li>Process your transactions</li>
                <li>Send you updates about our service</li>
                <li>Respond to your inquiries</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill 
                the purposes outlined in this Privacy Policy. Scan data is retained according 
                to your plan: 7 days (Free), 30 days (Pro), or until you delete it (Premium).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to 
                protect your personal information. However, no method of transmission over 
                the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Rights (GDPR)</h2>
              <p>If you are a resident of the European Economic Area, you have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Cookies</h2>
              <p>
                We use essential cookies to ensure our website functions properly. We also 
                use analytics cookies (with your consent) to understand how visitors interact 
                with our website. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Clerk (authentication)</li>
                <li>Stripe (payment processing)</li>
                <li>Vercel (hosting)</li>
                <li>Neon (database)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@painpointradar.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of 
                any changes by posting the new Privacy Policy on this page and updating the 
                &quot;Last updated&quot; date.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
