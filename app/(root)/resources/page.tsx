'use client';

import PageHeading from '@/components/PageHeading';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, BookOpen, Mic, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Resources() {
  const links = [
    {
      title: 'Affirmatives',
      href: '/resources/affirmatives',
      icon: Heart,
      color: 'bg-rose-500',
      gradient: 'from-rose-500/20 to-rose-500/5',
    },
    {
      title: 'Library',
      href: '/resources/library',
      icon: BookOpen,
      color: 'bg-emerald-500',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
    },
    {
      title: 'Podcast',
      href: '/resources/podcast',
      icon: Mic,
      color: 'bg-blue-500',
      gradient: 'from-blue-500/20 to-blue-500/5',
    },
  ];

  return (
    <main className='section-container py-10'>
      <header>
        <PageHeading
          title='Resources'
          enableBreadCrumb={true}
          layer2='Resources'
        />
      </header>

      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
        {links.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={item.href}>
              <Card className='rounded-2xl border-none shadow-premium hover:shadow-premium-xl transition-all cursor-pointer group overflow-hidden bg-card'>
                <div className={`w-full h-40 flex items-center justify-center bg-gradient-to-br ${item.gradient} group-hover:scale-105 transition-transform duration-500`}>
                  <div className={`p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-inner`}>
                    <item.icon className={`w-12 h-12 text-white fill-white/20`} />
                  </div>
                </div>
                <CardContent className='flex justify-between items-center p-6 bg-white dark:bg-zinc-900'>
                  <div className='flex flex-col gap-1'>
                    <h3 className='text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors'>
                      {item.title}
                    </h3>
                    <span className='text-sm text-zinc-500 dark:text-zinc-400'>
                      Explore our {item.title.toLowerCase()}
                    </span>
                  </div>
                  <div className={`p-2 rounded-full ${item.color} text-white group-hover:translate-x-1 transition-all shadow-lg shadow-${item.color.split('-')[1]}-500/30`}>
                    <ArrowRight className='w-5 h-5' />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
