const Home = ()=>{
  return (
   <div className="hero">
      <div className="hero-content text-center py-36">
        <div className="max-w-md">
          <h1 className="text-8xl font-medium">Citestat</h1>
          <p className="py-3 text-neutral-500 text-xl">
             See your impact on the world.
          </p>
          <input
             type="text"
             placeholder="Search for Author"
             className="input input-bordered w-full text-2xl px-6 py-6" />
        </div>
      </div>
    </div>
  );
};

export default Home;
