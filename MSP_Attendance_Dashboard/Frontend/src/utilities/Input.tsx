
interface Iprops extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}


const Input = ({ className , ...rest } : Iprops)  => {
  return (
      <input className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:opacity-40 ${className ? className : ''}`}
            {...rest}
      />
  )
}

export default Input

