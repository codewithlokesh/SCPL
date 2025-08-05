export const uploadFile = async (file, uploadPath = '/images/') => {
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `${uploadPath}${fileName}`;
    return {
      success: true,
      filePath: filePath,
      fileName: fileName,
      originalName: file.name
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 5MB'
    };
  }
  
  return {
    valid: true,
    error: null
  };
}; 