import './Home.less'

const Home = () => {
  return (
    <div className='h-full text-center flex justify-center select-none all:transition-400'>
      <div className='ma'>
        <div className='text-[#000] text-5xl fw100 animate-bounce-alt animate-count-infinite animate-duration-1s'>
          TailwindCSS
        </div>
        <div className='op30 text-lg fw300 m1'>TailwindCSS.</div>
      </div>
    </div>
  )
}

export default Home
