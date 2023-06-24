import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="homePageLinkContainer">
      <Link href="/notes" passHref>
        <a>Notes</a>
      </Link>
      <Link href="/graph" passHref>
        <a>Graph</a>
      </Link>
    </div>
  );
};

export default Home;
