import React from 'react';

export function AboutContent() {
  return (
    <div className="flex flex-col gap-4">
      <p>
        AURELLE began as a small, deliberately restrained edit — a handful of pieces chosen for how
        long they'd last, not how fast they'd sell. No seasonal clearance racks, no seventy-item
        homepage. Just wear, watches, and accessories that earn a permanent place in a wardrobe.
      </p>
      <p>
        Every piece in the collection is picked with the same question in mind: would this still
        feel right to wear in five years? If the answer isn't yes, it doesn't make the cut.
      </p>
      <p className="rounded-xl border border-line bg-paper px-4 py-3 text-xs text-ink-low sm:text-sm">
        Note for visitors: this storefront is a demo built to showcase a user-behavior funnel
        analytics pipeline — every click here streams to a telemetry backend for analysis. No real
        orders are placed.
      </p>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    question: 'What are your shipping timelines?',
    answer:
      'Standard shipping across India takes 4–6 business days. Metro cities typically see delivery within 3–4 days of dispatch.',
  },
  {
    question: "What's your return policy?",
    answer:
      'Unworn items in original packaging can be returned within 14 days of delivery for a full refund. Ethnic wear with tags intact follows the same window.',
  },
  {
    question: 'How do I find my size?',
    answer:
      'Each product page lists measurements in the description. If you\'re between sizes, we generally recommend sizing up for outerwear and true-to-size for shirts and footwear.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'UPI, major credit and debit cards, and net banking. Cash on delivery is available on select pin codes.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Not yet — this edit currently ships within India only.',
  },
];

export function FaqContent() {
  return (
    <div className="flex flex-col gap-5">
      {FAQ_ITEMS.map((item) => (
        <div key={item.question}>
          <p className="font-medium text-ink-high">{item.question}</p>
          <p className="mt-1.5">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

export function ContactContent() {
  return (
    <div className="flex flex-col gap-4">
      <p>Have a question about an order, a piece in the edit, or something else entirely? We read everything.</p>
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-4">
        <div>
          <p className="data-label mb-1">Email</p>
          <p className="text-ink-high">hello@aurelle.example</p>
        </div>
        <div>
          <p className="data-label mb-1">Studio hours</p>
          <p className="text-ink-high">Monday–Saturday, 10am–6pm IST</p>
        </div>
      </div>
      <p className="text-xs text-ink-low">
        This is a demo storefront, so this inbox isn't monitored — but on a live site, this is where
        we'd point you.
      </p>
    </div>
  );
}