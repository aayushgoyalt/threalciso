import React from 'react';
import { Header } from '@/components/public/Header';
import { Ticker } from '@/components/public/Ticker';
import { Footer } from '@/components/public/Footer';
import { connectDB } from '@/lib/db';
import { Category, SiteSettings } from '@/models';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();

  const [categories, settings] = await Promise.all([
    Category.find().sort({ order: 1 }).select('name slug').lean(),
    SiteSettings.findOne().lean(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header
        categories={categories.map((c) => ({
          name: c.name,
          slug: c.slug,
        }))}
      />
      <Ticker notice={settings?.tickerNotice} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

