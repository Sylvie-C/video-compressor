import "./ProgressBar.css"

import { useState , useEffect } from "react"

export default function ProgressBar ( { percent } ) { 

    const [ catAnimate02 , setCatAnimate02 ] = useState("")
    const [ catAnimate03 , setCatAnimate03 ] = useState("")

    useEffect (()=> {
        if (percent === 50) { 
          setCatAnimate02(true); 
        }
        if (percent === 100) {
          setCatAnimate03(true); 
        }
    }, [percent])

    return (
        <div className="progress-container" >
            <div className="progress-background">
              <span key="cat01" className="cat-icon">🐱</span>
              <span key="cat02" className={`cat-icon ${ catAnimate02 ? "cat-animate" : "" }`} >🐱</span>
              <span key="cat03" className={`cat-icon ${ catAnimate03 ? "cat-animate" : "" }`} >🐱</span>
            </div>
            <div className="progress-bar" style={{ width: `${percent}%` }}></div>

        </div>
    )
}