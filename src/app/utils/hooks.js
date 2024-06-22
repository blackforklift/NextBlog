import { useEffect, useState, useRef } from 'react';

export function useHeadsObserver() {
  const observer = useRef()
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const handleObsever = (entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }
  
    observer.current = new IntersectionObserver(handleObsever, {
      rootMargin: "-20% 0% -35% 0px"}
    )
  
    const elements = document.querySelectorAll("h2, h3", "h4")
  
    elements.forEach((elem) => observer.current.observe(elem))
    return () => observer.current?.disconnect()
  }, [])


  return {activeId}
}

// In the code above, we created a new instance of the Intersection Observer. We passed the handleObsever callback 
// and an options object where we have specified the circumstances under which the observer’s callback is executed.

// In object using the rootMargin property, we are shrinking the top of the root element by 20 percent, which is currently our entire page, 
// and the bottom by 35 percent. Therefore, when a header is at the top 20 percent 
// and bottom 35 percent of our page, it will not be counted as visible.