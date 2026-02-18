import { useState, useRef } from "react"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

import "./VideoCompressor.css"

import ProgressBar from "../ProgressBar/ProgressBar"

export default function VideoCompressor() {
  const [loaded, setLoaded] = useState(false)   // FFmpeg chargé ?
  const [loading, setLoading] = useState(false) // Compression en cours ?

  const [ fileInSize , setFileInSize ] = useState(null)     // Taille vidéo entrée
  const [ fileOutSize , setFileOutSize ] = useState(null)   // Taille vidéo sortie

  const [output, setOutput] = useState(null)    // URL de la vidéo compressée
  const ffmpegRef = useRef(new FFmpeg())        // Instance FFmpeg
  const videoRef = useRef(null)

  const [ cancel , setCancel ] = useState(false)  // Annuler compression en cours
  const [ error , setError ] = useState("")      // Message Erreur
  const [ progress , setProgress ] = useState(0) // Barre de progression


  // Charger FFmpeg depuis les fichiers locaux dans public/ffmpeg-core/
  const loadFFmpeg = async () => {
    setLoading(true);
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => console.log("Log message ffmpeg.wasm : " , message));

    ffmpeg.on("progress", ({ progress, time }) => {
      setProgress(Math.round(progress * 100));
    });

    const baseURL = "/video-compressor/ffmpeg-core";   // public/ffmpeg-core/

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      log: true,
    }); 
    
    setLoaded(true);
    setLoading(false);
  }

  // Compresser une vidéo
  const compressVideo = async (file) => {
    if (!file) return
    setLoading(true)

    const sizeIn = (file.size / 1000000).toFixed(2)
    setFileInSize(sizeIn)

    const ffmpeg = ffmpegRef.current
    
    // Écrire le fichier dans le FS virtuel
    await ffmpeg.writeFile("input", await fetchFile(file))

    try { 

      // On rejette uniquement ce qui est clairement non vidéo
      if (file.type && !file.type.startsWith("video/")) {
        setError("Ce fichier ne semble pas être une vidéo")
        return
      }

      // Commande de compression simple H.264
      await ffmpeg.exec([
        "-i", "input",
        "-c:v", "libx264",
        "-crf", "28",
        "output.mp4"
      ])

    }catch (err) {
      console.log ("Compression interrompue : " , err)
      setError ("Erreur : compression non effectuée.")
    }

    // Lire le fichier compressé
    const data = await ffmpeg.readFile("output.mp4")

    // Extraire taille du fichier compressé
    const sizeOut = (data.length /1000000).toFixed(2)
    setFileOutSize(sizeOut)

    // Extraire URL vers fichier compressé
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    setOutput(url)

    setLoading(false)
  }

  // Annuler la compression
  const cancelCompression = () => { 
    const ffmpeg = ffmpegRef.current
    ffmpeg.terminate()
    setCancel(true)
    ffmpegRef.current = new FFmpeg() // reinitialisation instance FFmpeg
  }

  return (
    <main className="content">
      {!loaded && (
        <button onClick={loadFFmpeg} disabled={loading} className="load-btn">
          {loading ? "C'est parti ! Un instant svp..." : "Commencer"}
        </button>
      )}

      {loaded && (
        <>
          { !output ? 
          <>
              <input
                type="file"
                onChange={(e) => compressVideo(e.target.files?.[0])}
                disabled={loading}
                className="input-container"
              />
              { fileInSize && <p>Votre fichier fait {fileInSize} Mo. </p>}

              { (error && !cancel) && 
                <>
                  <p> {error} </p>
                  <p>Rafraîchir le navigateur pour recommencer</p>
                </>
              }

            {(loading && !error) &&
              <div className="loading-container">
                {!cancel && <p>🐾 Compression en cours... 🐾</p> }
                <ProgressBar percent={ progress } />

                { !cancel &&
                  <button onClick={ cancelCompression } className="cancel-btn">
                    Annuler
                  </button>
                }
              </div>
            }

            { cancel && <p>Compression annulée (rafraîchir navigateur pour nouvelle compression)</p>}
          </>
            : 
            <div>
              <div className="output-container">
                <p>Votre vidéo est prête et fait maintenant {fileOutSize} Mo. </p> 
                <a href={output} download="compressed.mp4" className="download-link">
                  Télécharger 
                </a>

                <video ref={videoRef} src={output} controls width={300} className="video-output"></video>

              </div>
            </div>
          }
        </>
      )}
    </main>
  );
}
