'use client';

const SectionHeading = ({ title }: { title?: string | JSX.Element }) => {
  return (
    <>
      {title && (
        <div className='mb-5'>
          <h1 className='text-2xl font-bold'>{title}</h1>
        </div>
      )}
    </>
  );
};

export default SectionHeading;
