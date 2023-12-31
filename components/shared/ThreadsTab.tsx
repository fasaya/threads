import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import PostCard from "../cards/PostCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async ({
    currentUserId,
    accountId,
    accountType
}: Props) => {

    let result: any

    if (accountType === 'Community') {
        result = await fetchCommunityPosts(accountId)
    } else {
        result = await fetchUserPosts(accountId)
    }

    if (!result) return redirect('/')

    return (
        <section className="mt-9 flex flex-col gap-3">
            {result.threads?.map((thread: any) => (
                <PostCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === 'User'
                            ? { name: result.name, image: result.image, id: result.id }
                            : { name: thread.author.name, image: thread.author.image, id: thread.author }
                    }
                    community={accountType === 'User' && thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}

        </section>
    )
}

export default ThreadsTab