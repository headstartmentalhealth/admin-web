'use client';

import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import React from 'react';
import useMultimedia from '@/hooks/page/useMultimedia';
import SectionContent from '@/components/SectionContent';
import MultimediaList from '@/components/multimedia/MultimediaList';

const MediaLibrary = () => {
  const {
    multimedia,
    loading: multimediaLoading,
    count: totalMultimedia,
    currentPage: multimediaCurrentPage,
    onClickNext: multimediaOnClickNext,
    onClickPrev: multimediaOnClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useMultimedia();

  return (
    <main>
      <header className='section-container'>
        {/* Page Heading */}
        <PageHeading
          title='Media Library'
          enableBreadCrumb={true}
          layer2='Media Library'
        />

        {/* Filter */}
        <Filter
          pageTitle='Media Library'
          showSearch={true}
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
      </header>
      <SectionContent>
        <MultimediaList
          multimedia={multimedia}
          count={totalMultimedia}
          onClickNext={multimediaOnClickNext}
          onClickPrev={multimediaOnClickPrev}
          currentPage={multimediaCurrentPage}
          loading={multimediaLoading}
        />
      </SectionContent>
    </main>
  );
};

export default MediaLibrary;
