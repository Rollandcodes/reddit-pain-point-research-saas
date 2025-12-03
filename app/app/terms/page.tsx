import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <div className="container px-4 sm:px-6 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: December 3, 2025
            </p>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using PainPointRadar (&quot;Service&quot;), you agree to be bound by 
                these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, 
                please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
              <p>
                PainPointRadar provides a software-as-a-service platform that analyzes 
                publicly available Reddit discussions to identify pain points and market 
                opportunities for product development and research purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
              <p>To use certain features of our Service, you must:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Create an account with accurate information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Be at least 18 years old</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Acceptable Use</h2>
              <p>You agree NOT to use our Service to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Violate any laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service for any illegal or unethical purposes</li>
                <li>Resell or redistribute the Service without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Payment Terms</h2>
              <p>For paid plans:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payments are processed securely via Stripe</li>
                <li>Subscriptions renew automatically unless cancelled</li>
                <li>You may cancel at any time; access continues until the end of the billing period</li>
                <li>We offer a 14-day money-back guarantee for new subscriptions</li>
                <li>Prices may change with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned 
                by PainPointRadar and are protected by international copyright, trademark, 
                and other intellectual property laws.
              </p>
              <p className="mt-2">
                You retain ownership of any data you submit to the Service. By using the 
                Service, you grant us a limited license to process your data solely for 
                providing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Data and Privacy</h2>
              <p>
                Our use of your data is governed by our Privacy Policy. By using the Service, 
                you consent to the collection and use of information as described in our 
                Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF 
                ANY KIND, EXPRESS OR IMPLIED. We do not guarantee that the Service will be 
                uninterrupted, secure, or error-free.
              </p>
              <p className="mt-2">
                The insights and data provided by PainPointRadar are for informational 
                purposes only and should not be considered as professional business advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PAINPOINTRADAR SHALL NOT BE LIABLE 
                FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
                OR ANY LOSS OF PROFITS OR REVENUES.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">10. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, 
                without prior notice, for any reason, including breach of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users 
                of any material changes by posting the new Terms on this page and updating 
                the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws 
                of the United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">13. Contact Us</h2>
              <p>
                If you have questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> legal@painpointradar.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
