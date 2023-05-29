import './Home.less'

const Home = () => {
  return (
    <div className='h-full text-center flex select-none all:transition-400'>
      <div className='ma'>
        <div className='text-5xl fw100 animate-bounce-alt animate-count-infinite animate-duration-1s'>
          UnoCSS
        </div>
        <div className='op30 text-lg fw300 m1'>The instant on-demand Atomic CSS engine.</div>
      </div>
    </div>
  )
}

export default Home
