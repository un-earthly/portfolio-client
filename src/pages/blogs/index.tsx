import Head from "next/head";
import Link from "next/link";

interface BlogProps {
    title: string;
    content: string;
    id: string;
}

const Blog: React.FC<BlogProps> = ({ title, content, id }) => {
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

const Blogs: React.FC = () => {
    const blogs = [
        {
            id: "1",
            title: "Blog Title 1",
            content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, magna a faucibus malesuada, risus nisi accumsan velit, eget varius ipsum enim id nulla."
        },
        {
            id: "2",
            title: "Blog Title 2",
            content:
                "Nunc venenatis, nisl non congue hendrerit, nibh leo suscipit purus, vitae placerat nibh risus quis risus."
        },
        {
            id: "3",
            title: "Blog Title 3",
            content:
                "Sed gravida, est vitae sollicitudin elementum, est massa rhoncus enim, id congue leo lacus vel metus."
        }
    ];

    return (
        <div className="p-5 h-screen bg-black">
            <h1 className="text-3xl font-bold mb-5 text-orange-500 text-center">My Blogs</h1>
            <div className="flex flex-wrap">
                {blogs.map(blog => (
                    <div className="w-full md:w-1/3 px-3 mb-5" key={blog.id}>
                        <Blog title={blog.title} content={blog.content} id={blog.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blogs;
