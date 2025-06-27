
import { TopicItem } from "@/lib/mockData";

export const useModuleNavigation = (module: any, selectedItem: string) => {
  const getAllItems = () => {
    const items: { item: TopicItem; topicId: string }[] = [];
    module.topics.forEach((topic: any) => {
      topic.items.forEach((item: TopicItem) => {
        items.push({ item, topicId: topic.id });
      });
    });
    return items;
  };

  const getSelectedItem = () => {
    for (const topic of module.topics) {
      const item = topic.items.find((item: TopicItem) => item.id === selectedItem);
      if (item) return { item, topicId: topic.id };
    }
    return null;
  };

  const allItems = getAllItems();
  const currentIndex = allItems.findIndex(({ item }) => item.id === selectedItem);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return {
    getAllItems,
    getSelectedItem,
    allItems,
    prevItem,
    nextItem
  };
};
