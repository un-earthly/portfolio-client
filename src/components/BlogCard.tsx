import Head from "next/head";
import Link from "next/link";

interface BlogProps {
    title: string;
    content: string;
    id: string;
}

const BlogCard: React.FC<BlogProps> = ({ title, content, id }) => {
    return (
        <div className="flex flex-col bg-gray-800 rounded-lg p-5">
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h2 className="text-2xl font-bold mb-3 text-white">{title}</h2>
            <p className="text-lg leading-relaxed mb-3 text-white">{content}</p>
            <Link href="/blogs/[id]" as={`/blogs/${id}`}>
                <a className="bg-orange-500 text-center text-white px-3 py-2 rounded-lg hover:bg-orange-600">
                    Read More
                </a>
            </Link>
        </div>
    );
};

export default BlogCard