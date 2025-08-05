import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return (
    <div className="flex h-[calc(100vh-80px)] gap-2">
      {/* Ліва частина - Фільтри та список */}
      <div className="flex-1 flex flex-col">
        <div className="">
          <Filter />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={
            <div className="flex justify-center items-center h-full">
              <p className="text-lg text-gray-600">Завантаження...</p>
            </div>
          }>
            <Await
              resolve={data.postResponse}
              errorElement={
                <div className="flex justify-center items-center h-full">
                  <p className="text-lg text-red-500">Помилка завантаження!</p>
                </div>
              }
            >
              {(postResponse) => (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                  {postResponse.data.map((post) => (
                    <Card key={post.id} item={post} />
                  ))}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Права частина - Карта */}
      <div className="flex-1 hidden lg:block">
        <Suspense fallback={
          <div className="flex justify-center items-center h-full bg-gray-100">
            <p className="text-lg text-gray-600">Завантаження карти...</p>
          </div>
        }>
          <Await
            resolve={data.postResponse}
            errorElement={
              <div className="flex justify-center items-center h-full bg-gray-100">
                <p className="text-lg text-red-500">Помилка завантаження карти!</p>
              </div>
            }
          >
            {(postResponse) => <Map items={postResponse.data} className="h-full w-full" />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;