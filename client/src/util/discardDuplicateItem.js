export function discardDuplicateItem(oldItems, newItems) {
    const allItems = [...oldItems, ...newItems];
    const oldItemIds = oldItems.map((item) => item._id);
    const newItemsIds = newItems.map((item) => item._id);

    const uniqueItemIds = new Set([...oldItemIds, ...newItemsIds]);
    const uniqueItems = Array.from(uniqueItemIds).map((id) => {
        return allItems.find((item) => item._id === id);
    });
    console.log(uniqueItems);
    return uniqueItems;

    // const uniquePostIds = new Set([...oldPostIds, ...newPostIds]);
    // const uniquePosts = Array.from(uniquePostIds).map((id) => {
    //     return newPosts.find((post) => post._id === id);
    // });
    // return uniquePosts;
}
