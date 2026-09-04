/**
 * CLON FRANCO COLAPINTO F1 2026 - COMPORTAMIENTO Y TELEMETRÍA
 */

document.addEventListener("DOMContentLoaded", () => 
    
    {
  
  // 1. MANEJADOR DEL MENÚ MÓVIL ADAPTABLE
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  // 2. REPRODUCTOR DE STREAMING DE YOUTUBE
   // 2. REPRODUCTOR DE STREAMING ADAPTADO PARA MODO LOCAL ARCHIVO
  const playlistItems = document.querySelectorAll(".playlist-item");
  const btnPlayExternal = document.getElementById("btnPlayExternal");
  const videoTitleDisplay = document.getElementById("videoTitleDisplay");

  if (playlistItems.length > 0 && btnPlayExternal) {
    playlistItems.forEach(item => {
      item.addEventListener("click", () => {
        playlistItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        
        // Extraer metadatos e hipervínculos configurados en el nodo HTML
        const targetUrl = item.getAttribute("data-video-url");
        const videoTitle = item.querySelector(".playlist-meta h4").innerText;
        
        // Reconfigurar dinámicamente el botón de streaming local sin iFrames
        btnPlayExternal.setAttribute("href", targetUrl);
        if (videoTitleDisplay) videoTitleDisplay.innerText = videoTitle;
      });
    });
  }


  // 3. ANIMACIÓN DE ESTADÍSTICAS
  const statValues = document.querySelectorAll(".stat-value");
  
  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute("data-target"), 10) || 0;
    const duration = 1500;
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeOutQuad = progress * (2 - progress);
      const currentValue = Math.floor(easeOutQuad * target);
      
      element.innerText = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.innerText = target;
      }
    };
    requestAnimationFrame(updateNumber);
  };

  const observerOptions = { root: null, threshold: 0.2 };
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statValues.forEach(stat => animateCounter(stat));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsSection = document.getElementById("estadisticas");
  if (statsSection && statValues.length > 0) {
    statsObserver.observe(statsSection);
  }

  // 4. MOTOR DE TELEMETRÍA DINÁMICA
  const txtSpeed = document.getElementById("telSpeed");
  const speedBar = document.getElementById("speedBar");
  const txtGear = document.getElementById("telGear");
  const txtRpm = document.getElementById("telRpm");
  const txtThrottle = document.getElementById("txtThrottle");
  const barThrottle = document.getElementById("barThrottle");
  const txtBrake = document.getElementById("txtBrake");
  const barBrake = document.getElementById("barBrake");
  const gBall = document.getElementById("gBall");
  const gLatTxt = document.getElementById("gLat");
  const gLonTxt = document.getElementById("gLon");

  let timeline = 0;

  function runTelemetryLoop() {
    timeline += 0.02;

    let profile = Math.sin(timeline) * 0.6 + Math.sin(timeline * 0.4) * 0.4;
    let targetSpeed = 225 + Math.floor(profile * 110);
    if (targetSpeed > 335) targetSpeed = 335;
    if (targetSpeed < 100) targetSpeed = 100;
    
    let gear = "N";
    if (targetSpeed > 305) gear = "8";
    else if (targetSpeed > 275) gear = "7";
    else if (targetSpeed > 235) gear = "6";
    else if (targetSpeed > 195) gear = "5";
    else if (targetSpeed > 145) gear = "4";
    else gear = "3";

    let rpm = 10800 + Math.floor((targetSpeed % 35) * 120) + Math.floor(Math.random() * 120);

    let throttle = 0;
    let brake = 0;
    
    if (profile > -0.15) {
      throttle = Math.floor(75 + (profile * 25) + (Math.random() * 4));
      throttle = Math.min(100, Math.max(0, throttle));
      brake = 0;
    } else {
      throttle = 0;
      brake = Math.floor(Math.abs(profile) * 95);
      brake = Math.min(100, Math.max(0, brake));
    }

    let lateralG = (Math.cos(timeline * 1.3) * 3.4).toFixed(1);
    let longitudinalG = (profile * 2.2).toFixed(1);

    if (txtSpeed) txtSpeed.innerText = targetSpeed;
    if (speedBar) speedBar.style.width = `${((targetSpeed - 100) / 235) * 100}%`;
    if (txtGear) txtGear.innerText = gear;
    if (txtRpm) txtRpm.innerText = `${rpm.toLocaleString('de-DE')} RPM`;
    
    if (txtThrottle) txtThrottle.innerText = `${throttle}%`;
    if (barThrottle) barThrottle.style.width = `${throttle}%`;
    if (txtBrake) txtBrake.innerText = `${brake}%`;
    if (barBrake) barBrake.style.width = `${brake}%`;

    if (gBall) {
      let gBallX = 50 + (parseFloat(lateralG) * 11);
      let gBallY = 50 - (parseFloat(longitudinalG) * 11);
      gBall.style.left = `${gBallX}%`;
      gBall.style.top = `${gBallY}%`;
    }
    
    if (gLatTxt) gLatTxt.innerText = Math.abs(lateralG);
    if (gLonTxt) gLonTxt.innerText = longitudinalG;

    requestAnimationFrame(runTelemetryLoop);
  }

  runTelemetryLoop();
});
