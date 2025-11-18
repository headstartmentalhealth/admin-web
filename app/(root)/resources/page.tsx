'use client';

import PageHeading from '@/components/PageHeading';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Resources() {
  const links = [
    {
      title: 'Affirmatives',
      href: '/resources/affirmatives',
      image: '/images/affirmatives.jpg',
    },
    {
      title: 'Library',
      href: '/resources/library',
      image: '/images/library.jpg',
    },
    {
      title: 'Podcast',
      href: '/resources/podcast',
      image: '/images/podcast.jpg',
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
              <Card className='rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden'>
                <img
                  src={item.image}
                  alt={item.title}
                  className='w-full h-40 object-cover'
                />
                <CardContent className='flex justify-between items-center p-6'>
                  <h3 className='text-xl font-semibold group-hover:text-primary transition-colors'>
                    {item.title}
                  </h3>
                  <ArrowRight className='group-hover:translate-x-1 transition-transform' />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
