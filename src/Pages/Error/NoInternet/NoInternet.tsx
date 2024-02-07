function NoInternet() {
  return (
    <div className="flex w-[100%] min-h-screen bg-white pt-16 pb-12">
    
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-shrink-0 justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 48C37.2262 48 47.9482 37.2548 47.9482 24C47.9482 10.7452 37.2262 0 24 0C10.7738 0 0.0517883 10.7452 0.0517883 24C0.0517883 37.2548 10.7738 48 24 48Z"
                fill="#00145b"
              />
              <path
                d="M15.0532 22.5755C15.0532 21.345 15.0532 20.1144 15.0532 18.8858C15.0475 14.0192 18.5596 9.85911 23.3009 9.11808C28.5898 8.29067 33.4935 11.8825 34.4112 17.2521C35.2533 22.1858 32.1925 27.0908 27.4588 28.3924C27.3039 28.4346 27.1453 28.4807 26.9867 28.4941C26.4032 28.544 25.8878 28.1831 25.7443 27.636C25.5894 27.0485 25.8557 26.4515 26.4051 26.2058C26.6619 26.0906 26.9395 26.0253 27.2057 25.9313C30.3912 24.8159 32.4097 21.6579 32.1283 18.2254C31.8526 14.8601 29.2582 12.0361 25.9482 11.5024C21.5147 10.7883 17.4795 14.2745 17.4663 18.8378C17.4588 21.4218 17.4663 24.0057 17.4625 26.5878C17.4625 26.8124 17.4644 27.0428 17.421 27.2597C17.2926 27.9105 16.796 28.2849 16.1559 28.2426C15.5422 28.2004 15.0777 27.7281 15.0683 27.0658C15.0494 25.7335 15.0626 24.4012 15.0607 23.067C15.0607 22.9038 15.0607 22.7387 15.0607 22.5755C15.057 22.5755 15.0551 22.5755 15.0513 22.5755H15.0532Z"
                fill="white"
              />
              <path
                d="M22.9914 21.0394C22.8905 21.279 22.9332 21.5071 22.9332 21.7295C22.9293 24.7794 22.9371 27.8293 22.9293 30.8792C22.9216 34.0613 20.651 36.7757 17.4896 37.3911C17.0626 37.4735 16.626 37.5138 16.1893 37.4927C15.5198 37.4601 15.0753 37.0307 15.052 36.4249C15.0307 35.8211 15.4499 35.3534 16.1058 35.2728C16.4552 35.2288 16.8084 35.246 17.1558 35.1655C19.2769 34.6728 20.6548 32.938 20.6665 30.6856C20.6762 28.6996 20.6548 26.7155 20.6451 24.7295C20.6354 22.3755 20.6238 20.0215 20.6102 17.6694C20.6005 15.7524 21.6737 14.2227 23.4106 13.6802C24.9807 13.1913 26.6865 13.7147 27.7054 14.9971C28.7359 16.2949 28.8329 18.0834 27.948 19.4828C27.0727 20.8669 25.4367 21.5646 23.8201 21.2387C23.5407 21.1812 23.2631 21.1065 22.9856 21.0394H22.9914Z"
                fill="white"
              />
            </svg>
        </div>
        <div className="py-16">
          <div className="text-center">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              No Internet Connection !
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
           
          </div>
        </div>
      </main>
    </div>
  );
}

export default NoInternet;
