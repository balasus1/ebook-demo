import React, { useRef, useState, useEffect } from 'react';
import { ReactReader } from 'react-reader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import {
  faBars,
  faArrowLeft,
  faArrowRight,
  faPlus,
  faMinus,
  faHighlighter,
  faVolumeUp,
  faVolumeMute,
  faExchangeAlt,
  faTimes, // Close icon
  faColumns ,// Icon for column toggle
  faArrowCircleLeft 
} from '@fortawesome/free-solid-svg-icons';
import './ReactReaderWrapper.css';

const ReactReaderWrapper = ({ url }) => {
  const navigate = useNavigate(); 
  const [location, setLocation] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [currentPage, setCurrentPage] = useState('');
  const [highlights, setHighlights] = useState(() => {
    const savedHighlights = localStorage.getItem('epub-highlights');
    return savedHighlights ? JSON.parse(savedHighlights) : [];
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [flowMode, setFlowMode] = useState('paginated');
  const [columnMode, setColumnMode] = useState('auto'); // New state for columns
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const renditionRef = useRef(null);
  const menuRef = useRef(null); // Reference for the menu
  const readerContainerRef = useRef(null); // Reference for the reader container

  useEffect(() => {
    localStorage.setItem('epub-highlights', JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both the menu and the reader container
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        readerContainerRef.current && !readerContainerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRendition = (rendition) => {
    renditionRef.current = rendition;
    rendition.themes.fontSize(`${fontSize}px`);
    rendition.flow(flowMode);
    rendition.spread(columnMode); // Apply column mode when spread is set

    rendition.on('relocated', (location) => {
      const currentPageDisplay = `Page ${location.start.displayed.page} of ${location.start.displayed.total}`;
      setCurrentPage(currentPageDisplay);
    });

    highlights.forEach(({ cfiRange }) => {
      rendition.annotations.add(
        'highlight',
        cfiRange,
        {},
        null,
        'custom-highlight'
      );
    });
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleFlowMode = () => {
    const newFlowMode = flowMode === 'paginated' ? 'scrolled' : 'paginated';
    setFlowMode(newFlowMode);
    renditionRef.current?.flow(newFlowMode);

    if (newFlowMode === 'paginated') {
      renditionRef.current?.spread(columnMode); // Apply column mode when switching back to paginated
    }
  };

  const toggleColumnMode = () => {
    const newColumnMode = columnMode === 'auto' ? 'none' : 'auto'; // 'none' for one column, 'auto' for two columns
    setColumnMode(newColumnMode);

    if (flowMode === 'paginated') {
      renditionRef.current?.spread(newColumnMode);
    } else {
      alert('Column mode toggle works only in paginated mode.');
    }
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => {
      const newSize = prevSize + 2;
      renditionRef.current?.themes.fontSize(`${newSize}px`);
      return newSize;
    });
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => {
      const newSize = prevSize > 12 ? prevSize - 2 : prevSize;
      renditionRef.current?.themes.fontSize(`${newSize}px`);
      return newSize;
    });
  };

  const goToPrev = () => renditionRef.current?.prev();
  const goToNext = () => renditionRef.current?.next();

  const addHighlight = () => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    rendition.getContents().forEach((contents) => {
      const selection = contents.window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const cfiRange = contents.cfiFromRange(range);

        const newHighlight = {
          cfiRange,
          text: selection.toString(),
        };

        setHighlights((prevHighlights) => {
          rendition.annotations.add(
            'highlight',
            cfiRange,
            {},
            null,
            'custom-highlight'
          );
          return [...prevHighlights, newHighlight];
        });

        selection.removeAllRanges();
      }
    });
  };

  const deleteHighlight = (cfiRange) => {
    setHighlights((prevHighlights) => {
      const updatedHighlights = prevHighlights.filter((hl) => hl.cfiRange !== cfiRange);
      renditionRef.current?.annotations.remove(cfiRange, 'highlight');
      return updatedHighlights;
    });
  };

  const speakSelection = () => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    rendition.getContents().forEach((contents) => {
      const selection = contents.window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const text = selection.toString();
        if (text) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = () => setIsSpeaking(false);
          speechSynthesisRef.current.speak(utterance);
          setIsSpeaking(true);
        }
        selection.removeAllRanges();
      }
    });
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };
  const handleBackClick = () => {
    navigate('/'); // Navigate to homepage
  };

  return (
    <div className="react-reader-wrapper">
      <div className="menu-toggle-container">
        <button className="menu-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        {menuOpen && (
          <div className="menu-content" ref={menuRef}>
            <button className="close-menu" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faTimes} /> Close
            </button>
            <button onClick={goToPrev}>
              <FontAwesomeIcon icon={faArrowLeft} /> Previous
            </button>
            <button onClick={goToNext}>
              <FontAwesomeIcon icon={faArrowRight} /> Next
            </button>
            <button onClick={increaseFontSize}>
              <FontAwesomeIcon icon={faPlus} /> A+
            </button>
            <button onClick={decreaseFontSize}>
              <FontAwesomeIcon icon={faMinus} /> A-
            </button>
            <button onClick={addHighlight}>
              <FontAwesomeIcon icon={faHighlighter} /> Highlight
            </button>
            <button onClick={speakSelection} disabled={isSpeaking}>
              <FontAwesomeIcon icon={faVolumeUp} /> Speak
            </button>
            <button onClick={stopSpeaking} disabled={!isSpeaking}>
              <FontAwesomeIcon icon={faVolumeMute} /> Stop
            </button>
            <button onClick={toggleFlowMode}>
              <FontAwesomeIcon icon={faExchangeAlt} /> {flowMode === 'paginated' ? 'Scrolled' : 'Paginated'}
            </button>
            <button onClick={toggleColumnMode} disabled={flowMode === 'scrolled'}>
              <FontAwesomeIcon icon={faColumns} /> {columnMode === 'auto' ? 'One Column' : 'Two Columns'}
            </button>
            {flowMode === 'scrolled' && <p>Column toggle works only in paginated mode.</p>}
          </div>
        )}
      </div>
      <span>{currentPage}</span>
      <div className="highlight-list">
        <h3>Highlights</h3>
        {highlights.length > 0 ? (
          highlights.map((highlight, index) => (
            <div key={index} className="highlight-item">
              <span onClick={() => setLocation(highlight.cfiRange)}>
                {highlight.text}
              </span>
              <button onClick={() => deleteHighlight(highlight.cfiRange)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No highlights yet.</p>
        )}
      </div>
      <div className="reader-container" ref={readerContainerRef}>
        <ReactReader
          url={url}
          location={location}
          locationChanged={(epubcfi) => setLocation(epubcfi)}
          getRendition={handleRendition}
        />
       
       <button className="back-button night-mode" onClick={handleBackClick}>
  <FontAwesomeIcon icon={faArrowCircleLeft} /> Back to Home
</button>
      </div>
    </div>
  );
};

export default ReactReaderWrapper;
