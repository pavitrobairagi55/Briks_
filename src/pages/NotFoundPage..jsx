import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Sidebar>
      <div className="flex items-center justify-center h-[calc(100vh-72px)] w-full">
        <div>
          <h1 className="text-4xl font-bold">404 NOT FOUND</h1>
          <p>
            the page your looking for, coul not be found{" "}
            <span onClick={navigate(-1)}>go back</span>
          </p>
        </div>
      </div>
    </Sidebar>
  );
}

export default NotFoundPage;
