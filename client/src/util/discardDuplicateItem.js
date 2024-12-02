export function discardDuplicateItem(oldItems, newItems) {
    const allItems = [...oldItems, ...newItems];
    const oldItemIds = oldItems.map((item) => item._id);
    const newItemsIds = newItems.map((item) => item._id);

    const uniqueItemIds = new Set([...oldItemIds, ...newItemsIds]);
    const uniqueItems = Array.from(uniqueItemIds).map((id) => {
        return allItems.find((item) => item._id === id);
    });
    // console.log(uniqueItems);
    return uniqueItems;
}
