function normalizeFileName(fileName) {
    // Create a map of special characters to be replaced
    const specialChars = {
      'å': 'a', 'ä': 'a', 'ö': 'o',
      'Å': 'A', 'Ä': 'A', 'Ö': 'O',
      // Add other special characters as needed
    };
  
    // Create a regex pattern from the special characters map
    const regex = new RegExp(Object.keys(specialChars).join('|'), 'g');
  
    // Replace special characters with their normal equivalents
    return fileName.replace(regex, match => specialChars[match]);
  }
  