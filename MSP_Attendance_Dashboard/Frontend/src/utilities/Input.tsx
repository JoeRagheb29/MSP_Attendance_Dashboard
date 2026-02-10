
interface Iprops extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}


const Input = ({ className , ...rest } : Iprops)  => {
  return (
      <input className={`px-4 py-2.5 border rounded-lg shadow-sm hover:shadow-md placeholder:opacity-40 placeholder:font-normal placeholder:text-gray-800 bg-gray-50 text-gray-900 focus:border-r-blue-500 ${className ? className : ''}`}
            {...rest}
      />
  )
}

export default Input

