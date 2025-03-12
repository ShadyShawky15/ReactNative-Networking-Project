import { useEffect, useState } from "react"
import { View, Text, StyleSheet, RefreshControl, SafeAreaView, StatusBar, ActivityIndicator, FlatList, Button } from "react-native"
import { TextInput } from "react-native-gesture-handler"
export default function App() {
   const [postsData, setPostsData] = useState([])
   const [loading, setLoading] = useState(true)
   const [refreshing, setRefreshing] = useState(false)
   const [postTitle, setPostTitle] = useState("")
   const [postBody, setPostBody] = useState("")
   const [isPosting, setIsPosting] = useState(false)
   const [error, setError] = useState("")

   // Getting all posts
   const fetchData = async (limit = 10) => {
      try {

         const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`)
         const data = await response.json()
         setPostsData(data)
         setLoading(false)
      } catch (e) {
         console.error(e)
         setError("Failed to fetch data")
      }
   }

   // Adding new post in post list
   const addPost = async () => {
      try {

         setIsPosting(true)

         const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "post",
            headers: {

               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title: postTitle,
               body: postBody
            },)
         })
         const newPost = await response.json()
         setPostsData([newPost, ...postsData])
         setIsPosting(false)
         setPostBody("")
         setPostTitle("")
         setError("")
      } catch (e) {
         console.error(e)
         setError("Failed to add new post")
      }
   }

   const handleRefresh = () => {
      setRefreshing(true)
      fetchData(20)
      setRefreshing(false)
   }


   useEffect(() => { // effect to mount the component and fetch the data only one because no dependency
      fetchData()
   }, [])


   if (loading) {
      return (
         <SafeAreaView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="0000ff" />
            <Text>Loading...</Text>
         </SafeAreaView>
      )
   }


   return (
      <SafeAreaView style={styles.container}>

         {error ? <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View> :
            <>
               <View style={styles.inputContainer}>
                  <TextInput style={styles.input} value={postTitle} onChangeText={setPostTitle} placeholder="Post Title" />
                  <TextInput style={styles.input} value={postBody} onChangeText={setPostBody} placeholder="Post Body" />
                  <Button title={isPosting ? "Adding..." : "Add Post"} onPress={addPost} disabled={!(postBody && postTitle)} />
               </View>
               <View style={styles.listContainer}>
                  <FlatList data={postsData} renderItem={({ item }) => {
                     return (
                        <View style={styles.card}>
                           <Text style={styles.nameText}>{item.title}</Text>
                           <Text style={styles.typeText}>{item.body}</Text>
                        </View>
                     )
                  }}
                     ItemSeparatorComponent={() => (
                        <View style={{ height: 16 }} />)}
                     ListEmptyComponent={<Text>No Posts Found</Text>}
                     ListHeaderComponent={<Text style={styles.headerText}>Post List</Text>}
                     ListFooterComponent={<Text style={styles.footerText}>End of list</Text>}
                     refreshing={refreshing}
                     onRefresh={handleRefresh}
                     refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                     }
                  />

               </View>
            </>
         }

      </SafeAreaView>)
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "F5F5f5",
      paddingTop: StatusBar.currentHeight
   },
   card: {
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      borderWidth: 1
   },
   errorText: {
      fontSize: 16,
      color: "#D8000C",
      textAlign: "center"
   },
   errorContainer: {
      padding: 20,
      height: 30,
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#FFC0CB",
      borderWidth: 1,
      margin: 16
   },
   listContainer: {
      flex: 1,
      paddingHorizontal: 16
   },
   nameText: {
      fontSize: 30
   },
   typeText: {
      fontSize: 24,
      color: "#666666"
   },
   loadingContainer: {
      flex: 1,
      backgroundColor: "F5F5F5",
      paddingTop: StatusBar.currentHeight,
      justifyContent: "center",
      alignItems: "center"
   },
   headerText: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 12
   },
   footerText: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 12
   },
   inputContainer: {
      backgroundColor: "#f5f5f5",
      padding: 20,
      borderRadius: 8,
      borderWidth: 1
   },
   input: {
      borderRadius: 8,
      borderWidth: 1,
      height: 40,
      padding: 10,
      marginBottom: 8,
      borderColor: "gray"
   }
})