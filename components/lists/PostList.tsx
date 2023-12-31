'use client'
import PostCard from "@/components/cards/PostCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { useEffect, useState } from "react";

function PostList({ userId }: { userId: string }) {

    const [posts, setPosts] = useState<any[]>([])
    const [pageNumber, setPageNumber] = useState(1)
    const [haveMore, setHaveMore] = useState(false)
    const [isPostLoading, setIsPostLoading] = useState(true)
    const [isShowMoreLoading, setIsShowMoreLoading] = useState(false)

    const handleShowMore = async () => {
        setIsPostLoading(true)
        setIsShowMoreLoading(true)

        const result = await fetchPosts(pageNumber, 2);
        if (result) {
            setPosts(prevPosts => prevPosts.concat(result.posts));
            setHaveMore(result.isNext);
        }

        setIsPostLoading(false)
        setIsShowMoreLoading(false)
    }

    useEffect(() => {
        handleShowMore()
    }, [pageNumber])

    return (
        <>
            {posts.length === 0 ? (
                <div className="mt-5">
                    {isPostLoading
                        ? <p className="no-result">Loading ...</p>
                        : <p className="no-result">
                            No threads found
                            <br />
                            <span
                                className="cursor-pointer"
                                onClick={() => {
                                    handleShowMore(); console.log('ss');
                                }}
                            >
                                Click here to refresh
                            </span>
                        </p>}
                </div>
            ) : (
                <>
                    <section className="mt-9 flex flex-col gap-3" >
                        {posts.map((post: any) => (
                            <PostCard
                                key={post._id}
                                id={post._id}
                                currentUserId={userId}
                                parentId={post.parentId}
                                content={post.text}
                                author={post.author}
                                community={post.community}
                                createdAt={post.createdAt}
                                comments={post.children}
                            />
                        ))}
                    </section>

                    {isShowMoreLoading ? (
                        <p className="mt-4 text-center !text-base-regular text-light-2">Loading ...</p>
                    ) : (
                        haveMore ? (
                            <p className="mt-4 text-center !text-base-regular text-light-2 cursor-pointer"
                                onClick={() => setPageNumber(pageNumber + 1)}>
                                Show more
                            </p>
                        ) : (
                            <p className="mt-4 no-result cursor-default">You&apos;ve reach the end</p>
                        )
                    )}
                </>
            )}
        </>
    )
}

export default PostList