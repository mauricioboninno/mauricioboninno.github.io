  const element = document.getElementById("footer-text");

  const loadDateTime = () => {
    const now = new Date();

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(now);
  };

  let showDefaultText = true;

  function parseFooterType(isDefaultText, defaultText, dateTimeText) {
    element.innerHTML = isDefaultText ? defaultText : dateTimeText;
  }

  function updateFooterType() {
    element.classList.remove("animate__fadeIn");
    element.classList.add("animate__fadeOut");

    const defaultText = `made with <span>&lt;3</span> by <a href="mailto:mauricio@boninno.com.ar">@mau</a> in 3 minutes`;
    const dateTimeText = loadDateTime();
  
    setTimeout(() => {
      parseFooterType(showDefaultText, defaultText, dateTimeText)

      element.classList.remove("animate__fadeOut");
      element.classList.add("animate__fadeIn");
  
      showDefaultText = !showDefaultText;
    }, 500);
  }

  export function handleFooterCycling() {
    setInterval(updateFooterType, 15000);
    updateFooterType();
  }