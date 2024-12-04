import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactReaderWrapper from './ReactReaderWrapper';

const ReaderPage = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  if (!url) {
    return <p>Error: No book URL provided!</p>;
  }

  return <ReactReaderWrapper url={url} />;
};

export default ReaderPage;
