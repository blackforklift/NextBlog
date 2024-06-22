import React, { useEffect, useState } from 'react';
import styles from './Toc.module.css'; 

import { useHeadsObserver } from '../../utils/hooks'

const Toc = ({ data }) => {

    const {activeId} = useHeadsObserver()

  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const document = new DOMParser().parseFromString(data, 'text/html');
    const elements = Array.from(document.querySelectorAll('h1,h2, h3, h4')).map(
      (elem) => ({
        id: elem.id,
        text: elem.innerText,
        level: "head"+parseInt(Number(elem.nodeName.charAt(1))),
      })
    );
    setHeadings(elements);
  }, [data]);



  return (
    <div className={styles.tocContainer}>
      <h2 className={styles.tocTitle}>Table of Contents</h2>
      <ul>
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={
              heading.level === "head1"
                ? { margin: "10px 0 0 0px", listStyleType: "circle" }
                : heading.level === "head2"
                ? { margin: "10px 0 0 20px", listStyleType: "disc" }
                : { margin: "10px 0 0 35px", listStyleType: "square" }
            }
          >
            <a href={`#${heading.id}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default Toc;
