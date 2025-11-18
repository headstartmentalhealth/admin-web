import React from 'react';

const SectionContent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className='section-container-padding-0'>
      <div className='overflow-x-auto rounded-none'>
        <div className='relative overflow-x-auto'>{children}</div>
      </div>
    </section>
  );
};

export default SectionContent;
