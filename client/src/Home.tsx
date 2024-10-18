const Home = ()=>{
  return (
   <div className="hero min-h-[calc(100vh-91px)]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-medium">Citestat</h1>
          <p className="py-3">
             See your impact on the world.
          </p>
          <input
             type="text"
             placeholder="Search for Author"
             className="input input-bordered w-full" />
        </div>
      </div>
    </div>
  );
};

export default Home;