import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View, Text } from "react-native";
import { getCourseList, GetCategory, FilteredCategoryCourseList } from "../services";
import CourseItem from "./CourseItem";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import DropdownComponent from "./DropdownComponent";

const CourseList = ({ searchText }) => {
  const [courseList, setCourseList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const navigation = useNavigation();
  const [mostPopularCourse, setMostPopularCourse] = useState("");

  useEffect(() => {
    getCourses();
    getCategory();
  }, [searchText]);

  const getCourses = () => {
    getCourseList()
      .then((resp) => {
        if (resp?.courseLists) {
          let sortedCourseList = resp.courseLists.sort((a, b) => b.counterEnroll - a.counterEnroll);
          setCourseList(sortedCourseList);
  
          const mostPopularCourseName = sortedCourseList.length > 0 ? sortedCourseList[0].name : null;
          setMostPopularCourse(mostPopularCourseName);
        }
      })
      .catch((error) => {
        console.error("Kurslar alınırken bir hata oluştu:", error);
      });
  };

  const getCategory = () => {
    GetCategory()
      .then((resp) => {
        if (resp && resp.courseLists) {
          let sortedCategories = resp.courseLists.sort((a, b) => b.counterEnroll - a.counterEnroll);
          const filteredCategories = sortedCategories.reduce((uniqueCategories, newCategory) => {
            if (typeof newCategory.tags === 'string') {
              if (newCategory.tags.trim() !== "" && !uniqueCategories.some((existingCategory) => existingCategory.tag === newCategory.tags)) {
                uniqueCategories.push({ tag: newCategory.tags, isPopular: false });
              }
            } else if (Array.isArray(newCategory.tags)) {
              newCategory.tags.forEach(tag => {
                if (tag.trim() !== "" && !uniqueCategories.some((existingCategory) => existingCategory.tag === tag)) {
                  uniqueCategories.push({ tag, isPopular: false });
                }
              });
            }
            return uniqueCategories;
          }, []);
          
          const mostPopularCategory = filteredCategories.length > 0 ? filteredCategories[0] : null;
  
          if (mostPopularCategory) {
            mostPopularCategory.isPopular = true;
          }
  
          setCategories(filteredCategories);
        } else {
          console.error("Geçersiz kategori yanıtı:", resp);
        }
      })
      .catch((error) => {
        console.error("Kategori alınırken bir hata oluştu:", error);
      });
  };

  const handleCategoryPress = async (category, index) => {
    setActiveIndex(index);
    try {
      const result = await filteredCourseList(category.tag);
      setCourseList(result.courseLists);
    } catch (error) {
      console.error("Kurslar filtrelenirken bir hata oluştu:", error);
    }
  };

  const filteredCourseList = async (category) => {
    try {
      const result = await FilteredCategoryCourseList(category);
      return result;
    } catch (error) {
      console.error("filteredCourseList hatası:", error);
      throw error;
    }
  };

  const displayCourses = courseList.filter((course) => {
    if (searchText && !course.name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <ScrollView>
      <View>
        <DropdownComponent courseList={courseList} setCourseList={setCourseList} categories={categories} handleCategoryPress={handleCategoryPress} />
      </View>
      <Text style={styles.header}>Tüm Kurslar</Text>
      <FlatList
        data={displayCourses}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("CourseDetail", { course: item })}>
            <CourseItem item={item} isPopular={item.name === mostPopularCourse} />
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default CourseList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: 90,
    height: 75,
  },
  activeCategory: {
    borderWidth: 2,
    borderColor: "blue",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
