<template>
  <v-container class="wrapper--thin">
    <div class="text-xs-center">
      <h1 class="font-weight-medium mb-3">FAQ</h1>
      <p class="grey--text">Most frequent questions and answers</p>
    </div>
    <div v-for="(section, i) in sections" :key="i">
      <h2 v-if="section.title">{{ section.title }}</h2>
      <v-expansion-panel
        v-for="(faq, i) in section.faqs"
        :key="i"
        class="faq my-4"
      >
        <v-expansion-panel-content>
          <div slot="header" class="title">{{ faq.question }}</div>
          <v-card>
            <v-card-text class="subheading" v-html="faq.answer"></v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      seekerSections: [
        {
          title: 'About',
          faqs: [
            {
              question: 'What is Carrus.io?',
              answer:
                '<p>Carrus.io is an on-demand coaching platform that glues together the highly fragmented pieces of today’s job search. Our platform allows anyone to look for and hire qualified coaches to help with all parts of their career. Coaches can help prepare a resume or cover letter, to more hands-on career-coaching and advice on building the skills in today’s rapidly changing world.</p>',
            },
            {
              question: 'How does it work?',
              answer: `<p>On Carrus.io you’ll find a range of coaches. Here’s a quick guide to getting started.</p>
              <p><strong>Step 1. Post a request</strong></p>
              <p>Start by posting your request from your home page dashboard. You can select your budget, the type of coaching you want, your industry, and your budget. For example, “Need help writing my resume” or “Need help/advice as a new manager of a team of 5” or “Need advice on upcoming job search in X industry.” Be as detailed as possible in your request.</p>
              <img src="${require('@/assets/images/faqs/client-how-does-it-work-1.png')}">
              <img src="${require('@/assets/images/faqs/client-how-does-it-work-2.png')}">
              <p><strong>Step 2. Talk to coaches</strong></p>
              <p>We will send your request to relevant coaches (or, you can browse for coaches in “find a coach” if you’d like). When coaches see and are interested in your request, they will directly message you to start a conversation. From there, you can schedule a call with them to gauge chemistry.</p>
              <img src="${require('@/assets/images/faqs/client-how-does-it-work-3.png')}">
              <p><strong>Step 3. Select a coaching package or hourly coaching.</strong></p>
              <p>Once you have decided on a coach you can hire them directly through Carrus. On the coaches profile page, you can “pay as you go” for one hour of coaching. You can also select one of their coaching packages from their profile page, which is usually a set number of hours for a fixed-price.</p>
              <img src="${require('@/assets/images/faqs/client-how-does-it-work-4.png')}">
              <p>You can always buy another hour of coaching from your “My Orders” page.</p>
              <img src="${require('@/assets/images/faqs/client-how-does-it-work-5.png')}">
              <p>Lastly, after your coaching session(s) are done, you can also leave your coach a review from your My Orders page.</p>
              `,
            },
            {
              question: 'What can I ask a coach?',
              answer: `<p>Anything! Well, almost. Whether you’re thinking about a career change, or looking for advice on building a specific skillset, you’re pretty much free to post anything as a request. Even if you’re not sure, just go ahead and post your request -- we’ll put you in touch with coaches that are the best match.</p>
              <ul>
                <li>Resume-writing</li>
                <li>Cover-letter writing </li>
                <li>LinkedIn keyword optimization, redoing your LinkedIn profile, and personal branding</li>
                <li>Interview preparation and advice</li>
                <li>Salary negotiation advice</li>
                <li>Managing stress at work</li>
                <li>Finding work you love</li>
                <li>Building new skills</li>
                <li>Crushing it in the first 90 days of your job</li>
                <li>Being a better leader</li>
                <li>Improving communication at work</li>
                <li>Career planning and career-coaching (either on a one-time or ongoing basis)</li>
              </ul>
              `,
            },
            {
              question: 'How much does it cost?',
              answer: `<p>Prices vary depending on the coach’s experience and the number of hours of coaching you need. The great news is that you can start a chat with any coach on Carrus.io before paying for anything. Most of them provide a free 1 hour coaching session. When searching you can filter coaches by “1 Hour Free Coaching Session” and see who is open to chat.</p>
              <img src="${require('@/assets/images/faqs/client-how-much-does-it-cost-1.png')}">
              `,
            },
            {
              question: 'What are coaching categories?',
              answer: `<p>At Carrus we categorize coaches into several categories which you can search for/filter by in the “Find a Coach” page.</p>
              <p>They are…</p>
              <ol>
                <li>Career Coaching</li>
                <li>Interview Coaching</li>
                <li>CV/Resume Advice</li>
                <li>Executive Coaching</li>
                <li>Business Coaching</li>
                <li>Performance Coaching</li>
                <li>New Skills Coaching</li>
                <li>Leadership Coaching</li>
                <li>Newly Assigned Leader Coaching</li>
                <li>Communication/Presentation Coaching</li>
                <li>Entrepreneur Coaching</li>
              </ol>
              <a href="https://carrus.io/coaching-categories/" target="_blank">For a list of detailed explanations please click here.</a>
              `,
            },
            {
              question: 'What is a certified coach?',
              answer: `<p>A certified coach needs to have proof of completing one of the following certifications through the <a href="https://coachfederation.org/" target="_blank">international coaching federation, or ICF</a>, the gold standard of coaching. You can filter by certified coaches in Find a Coach. Those who have the credential will receive a “certified” sticker visible on their profile.</p>
              <img src="${require('@/assets/images/faqs/client-what-is-certified-coach-1.png')}">
              `,
            },
            {
              question:
                'How do you ensure the privacy of my resume and other information?',
              answer: `<p>We will never share your information with third parties outside of the platform. Your resume is never searchable, and only available to coaches who you grant access to.</p>`,
            },
            {
              question: 'How do I pay?',
              answer: `<p>When you select hourly coaching or a package on a coaches profile you can pay them directly. We accept all credit cards and debit cards. (For now we don’t use Paypal).</p>`,
            },
            {
              question: 'What if I have a dispute or want a refund?',
              answer: `<p>Please send us a message at <a href="mailto:${this.$store.state.supportEmail}">${this.$store.state.supportEmail}</a> detailing the problem and we’ll get back to you ASAP.</p>`,
            },
            {
              question: 'How does Carrus.io make money?',
              answer: `<p>Carrus.io charges coaches a 15% service fee depending on the total amount they’ve billed with a client.</p>`,
            },
            {
              question: 'I have more questions, how do I reach you?',
              answer: `<p>We’re happy to chat anytime and welcome feedback. Drop us a message at <a href="mailto:${this.$store.state.supportEmail}">${this.$store.state.supportEmail}</a></p>`,
            },
          ],
        },
      ],
      coachSections: [
        {
          title: 'About',
          faqs: [
            {
              question: 'What is Carrus?',
              answer:
                '<p>Carrus.io allows you to tap into a network of people who are looking for help in their careers. Millions of people are looking for specific advice on their interviews, advice on becoming new managers, and guidance on growing specific skills. They are looking for immediate feedback and advice, and many are looking for longer-term coaches to hold them accountable to their goals. You can offer your services and gain immediate access to a new stream of customers and fulfill an important need in today’s rapidly changing job market.</p>',
            },
            {
              question: 'How does it work?',
              answer: `<p>Clients find your profile in one of two ways. First, they can search for your profile based on keywords and criteria such as budget, language, and industry. They select one of your coaching packages, and then pay you directly through the platform.</p>
              <img src="${require('@/assets/images/faqs/how-does-it-work-1.png')}">
              <p>Second, they can post a “request” with specific details about what they need help with. All currently live requests appear in the “Open Requests” tab in your dashboard. When you see a request that you can help with, you can directly message clients to start a conversation. From there, clients can pay your for an hour of coaching, or you can ask them to select a certain package depending on their needs.</p>
              <img src="${require('@/assets/images/faqs/how-does-it-work-2.png')}">`,
            },
          ],
        },
        {
          title: 'Account Setup',
          faqs: [
            {
              question: 'How do I setup my account?',
              answer: `<p>There are four steps to setup your account.</p>
              <ol>
                <li>Fill out your profile</li>
                <li>Create  your coaching packages</li>
                <li>Connect your Stripe account</li>
                <li>Make your profile public</li>
              </ol>
              <p>To fill out your profile, you’ll need to add a few basic pieces of information including a simple description of your background, hourly rate, timezone, languages, your industry expertise, type of coaching you offer, a profile pic and a tagline.</p>
              <img src="${require('@/assets/images/faqs/how-do-i-setup-my-account-1.png')}">`,
            },
            {
              question: 'What are coaching packages?',
              answer: `<p>Coaching packages are the section of your profile where you can create a description of the services you offer, set a specific price and decide on the rough number of hours for the package (you can always increase this later).</p>
              <img src="${require('@/assets/images/faqs/what-are-coaching-packages-1.png')}">
              <p>They are two types of packages, hourly and fixed price. You can mix and match these, or just choose one type. Most coaches have both.</p>
              <p><strong>Hourly</strong> - By default, your profile has “Standard Hourly Coaching” filled in, which is whatever hourly rate you decided on in your About Me section. When clients select this package, they only pay for one hour at a time. This is good for ad-hoc coaching, short sessions and for new clients who are unsure whether they would like to buy a package from you yet.</p>
              <p><strong>Fixed Price</strong> - Many coaches prefer to work with fixed packages rather than hourly. For example, you can create a package titled “Career Coaching – Find Your Dream Job” for a fixed price of $500 over a period of 5 sessions (hours). Or, whatever you want. Some coaches give a 5-10% discount for packages. The full amount of packages are paid up front.</p>
              <img src="${require('@/assets/images/faqs/what-are-coaching-packages-2.png')}">`,
            },
            {
              question: 'How do I setup Stripe?',
              answer: `<p>We ask that all coaches register an account on Stripe, which is an online payment processing tool for businesses and individuals. This will allow secure payments to be reflected directly in your local bank account within 7 days of receiving client payments. Registration on Stripe is free and takes about ten minutes. <a href="/coach/settings/">Click here to register.</a></p>
              <p>Once you register, you can connect your personal stripe account in the Settings page of the Carrus dashboard.</p>
              <img src="${require('@/assets/images/faqs/how-do-i-setup-stripe-1.png')}">
              <p>Unlike other platforms, we do not hold any money in escrow. When a client makes a payment, it goes directly to your account as a coach (and our 15% transaction fee is automatically deducted). This allows for safer and faster transaction times.</p>`,
            },
          ],
        },
        {
          title: 'Payments',
          faqs: [
            {
              question: 'How do I refund money?',
              answer: `All refunds are issued directly by Carrus via the Stripe payment platform. If a client requests their money back for whatever reason, we will review the case and issue a refund. In the case of a mistaken order, or if you cannot complete a coaching session for whatever reason and need to issue a refund, please send us a message at <a href="${this.$store.state.supportEmail}">${this.$store.state.supportEmail}</a>`,
            },
            {
              question: 'How do I view my payments info?',
              answer: `<p>There are two places where you can view your payments. First in the “My orders” tab on the Carrus dashboard, where you can see your order history and message the client directly.</p>
              <img src="${require('@/assets/images/faqs/how-do-i-view-payments-1.png')}">
              <p>Second you can also view all of your transactions and pending payouts in “Payments” in your Stripe dashboard, which you can login to from Settings in the Carrus dashboard. </p>`,
            },
            {
              question: 'What if I have a dispute?',
              answer: `<p>We ask that you first try and resolve the issue directly with the customer. If there’s still an issue, Carrus will serve as an arbiter in case we need to issue a refund. Please send us a message at <a href="mailto:${this.$store.state.supportEmail}">${this.$store.state.supportEmail}</a> detailing the problem and we’ll get back to you ASAP.</p>`,
            },
            {
              question: 'What transaction fee does Carrus charge?',
              answer: `<p>The client bears the responsibility for the Stripe transaction fee, which varies from 2-5% depending on your country's card. Stripe charges a fee for each transaction that happens within your marketplace. Always refers to the Stripe pricing page for your country to get the latest prices.</p>`,
            },
          ],
        },
        {
          title: 'Using the Service',
          faqs: [
            {
              question: 'What services can I offer?',
              answer: `<p>You can offer any of your coaching services, career related and professional advice. If you have particular knowledge of an industry, company, or working in a specific geography, make sure it’s clear on your profile page so that clients can filter search results and find you (for example, if you have done hiring or coaching for X company in X country, be specific).</p>
              <p>
                <a href="https://carrus.io/coaching-categories/" target="_blank">Click here to see a full list of coaching categories and their descriptions.</a>
              </p>
              <p>Here are some examples of services you can (but are not limited to) offer.</p>
              <ul>
                <li><em>Resume-writing.</em> Give clients a resume review and detailed feedback on the content and structure of what they’ve written.</em> </li>
                <li><em>Cover-letter writing.</em> The average client applies for 30 jobs online during their job search, often rehashing the same cover letter. There is a need for customized and high quality cover-letters for each application.</li>
                <li><em>Interview Coaching.</em> This includes interview preparation, advice, follow-up and debrief. This is particularly helpful for clients who are applying directly to companies and not using a recruiter that need help that they wouldn’t get otherwise.</li>
                <li><em>LinkedIn keyword optimization.</em> Redoing and revamping their LinkedIn profile based on your industry expertise.</li>
                <li><em>Salary negotiation:</em> As a skilled negotiator you can share your advice based on years of experience. Help clients get the best deals and build long-standing relationships.</li>
                <li><em>Career-coaching.</em> You can offer this on a one-time service or on an ongoing basis. Career-coaching is broad and can encompass anything from interview prep, career planning, job offer negotiation, communication, and advice on being a new manager. Many coaches choose to give a ‘free consultation’ before signing up clients, which will appear on your profile.</li>
                <li><em>Leadership Coaching.</em> Help leaders who want to gain an edge in self-marketing, branding, and individuals targeted as future leaders who need to sharpen their skills.</li>
                <li><em>Performance coaching.</em> Help improve and direct an individual’s performance in their current role at work to increase their effectiveness and productivity.</li>
                <li><em>Skills Coaching on time management, productivity, burnout, and soul-searching.</em> More broadly ‘coaching; isn’t just about what people do on the job, but often touches various aspects of life, from one’s health, activities outside of work, decision making, and much more.</li>
              </ul>`,
            },
            {
              question: 'How do I make my profile more attractive?',
              answer: `<p>Provide a guarantee of value-added services to clients. Consider adding the following offerings to your profile.</p>
              <p><strong>Add a descriptive tag-line.</strong> For example, if you have a niche in a certain industry then make it clear.  Or if you prefer, consider adding a favorite quote. Keep in mind that what you write in your tag line is also searchable by clients.</p>
              <p><strong>Have a Free Call or Chat.</strong>  Before agreeing to work together, have an introductory call or chat, go over the client’s needs, and guage chemistry. You can use this to get to know the client better, establish a relationship, and suggest the best approach. In your profile you can select “1 hour free coaching session,” which will appear in the search results for clients.</p>
              <p><strong>Provide Multiple Drafts or Unlimited Edits.</strong> There are often multiple drafts and revisions to ensure client satisfaction with their resumes and cover letters. It’s very rare that a client will actually request more than two or three drafts, but providing an “unlimited edits” clause will give clients peace-of-mind that you will get the job done and provide great customer service.</p>
              <p><strong>Offer a Competitive Price.</strong> The market price for resume revisions, for example, can start at anywhere from $50, and go up to $200 depending on the industry, level of expertise, and urgency. It can be helpful to start at a low price, build your reputation on the platform, and then raise your prices as you gain ratings and positive feedback.</p>
              `,
            },
            {
              question: 'What is a certified coach?',
              answer: `<p>A certified coach needs to have proof of completing one of the following certifications through the <a href="https://coachfederation.org/" target="_blank">international coaching federation</a>, or ICF.</p>
              <ul>
                <li>ACC</li>
                <li>PCC</li>
                <li>MCC</li>
              </ul>
              <p>Those who have the credential will receive a “certified” sticker visible on their profile. If you are a certified coach and would like the certified sticker, please send us a message at <a href="mailto:${this.$store.state.supportEmail}">${this.$store.state.supportEmail}</a> and we’ll enable it.</p>`,
            },
            {
              question: 'I have more questions, how do I reach you?',
              answer: `We’re happy to chat anytime and welcome feedback. Drop us a message at <a href="mailto:${this.$store.state.supportEmail}">${this.$store.state.supportEmail}</a>`,
            },
          ],
        },
      ],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    sections() {
      return this.user.role === 'coach'
        ? this.coachSections
        : this.seekerSections
    },
  },
}
</script>

<style lang="scss">
.faq {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  ol {
    margin-bottom: 1em;
  }
  img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
    margin-bottom: 1em;
    border-radius: 5px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}
</style>
