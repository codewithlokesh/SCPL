// components/SweetAlert.js
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const SweetAlert = {
  success: (title = 'Success', text = '', options = {}) =>
    MySwal.fire({
      icon: 'success',
      title,
      text,
      ...options,
    }),

  error: (title = 'Error', text = '', options = {}) =>
    MySwal.fire({
      icon: 'error',
      title,
      text,
      ...options,
    }),

  warning: (title = 'Warning', text = '', options = {}) =>
    MySwal.fire({
      icon: 'warning',
      title,
      text,
      ...options,
    }),

  confirm: async ({
    title = 'Are you sure?',
    text = 'You won’t be able to revert this!',
    confirmButtonText = 'Yes',
    cancelButtonText = 'Cancel',
    ...rest
  } = {}) => {
    const result = await MySwal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      ...rest,
    });
    return result.isConfirmed;
  },
};
