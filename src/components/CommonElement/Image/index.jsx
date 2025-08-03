import React from 'react';
import { COMMON_IMAGE_URL, ADMIN_IMAGE_URL, FRONTEND_IMAGE_URL, SUPER_ADMIN_IMAGE_URL } from '../../../config/index';

export function Image({ previewSource = '', imageFor = 'common', source, alt = 'image', ...rest }) {
  const imagePath = {
    common: COMMON_IMAGE_URL,
    admin: ADMIN_IMAGE_URL,
    superadmin: SUPER_ADMIN_IMAGE_URL,
    frontend: FRONTEND_IMAGE_URL
  };
  return (
    <>
      {previewSource ? (
        <img src={previewSource} alt={alt} {...rest} />
      ) : (
        <img src={`${imagePath[imageFor]}/${source}`} alt={alt} {...rest} />
      )}
    </>
  );
}
