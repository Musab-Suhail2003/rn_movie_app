import search from "@/app/(tabs)/search";
import {Client, Databases, Query, ID, Account} from "react-native-appwrite";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const COLLECTION_ID_2 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_2!;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

let user_id: string = '';

export const updateSearchCount = async (query: string, movie: Movie)=>{
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, 
            [Query.equal('searchTerm', query)]
        );
    
        if(result.documents.length > 0) {
            const existingMovie = result.documents[0];
    
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            );
        }else{
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),
                {
                    searchTerm: query,
                    count: 1,
                    movie_id: movie.id,
                    title: movie.title,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
            );
        }
        console.log(result);
    }
    catch(error){
        console.error("Error updating search count:", error);
        throw error;
    }
}

export const updateSaved = async (userId: string, movie: MovieDetails) => {
  try {
    console.log("COLLECTION_ID_2:", COLLECTION_ID_2);
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID_2, [
      Query.equal('userId', userId)
    ]);
    // Convert movie id to string and ensure it's within allowed length
    const movieIdStr = String(movie.id).substring(0, 20);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      const existingSaved = existingMovie.saved || [];

      // Check if the movieId already exists; if not, add it
      const updatedSaved = existingSaved.includes(movieIdStr)
        ? existingSaved
        : [...existingSaved, movieIdStr];

      // Alternatively, you can use a Set to ensure uniqueness:
      // const updatedSaved = Array.from(new Set([...existingSaved, movieIdStr]));

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_2,
        existingMovie.$id,
        {
          userId: userId,
          saved: updatedSaved,
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_2,
        ID.unique(),
        {
          userId: userId,
          saved: [movieIdStr],
        }
      );
    }
    console.log(result);
  } catch (error) {
    console.error("Error Saving:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> =>{
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ]);
        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        throw undefined;
    }
}

export const login = async (email: string, password: string): Promise<any> => {
    const account = new Account(client);
    try {
      const response = await account.createEmailPasswordSession(email, password);
      console.log("Login successful:", response);
      const user = await account.get();
      const answer = {response, user};
      
      return answer;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
};

export const register = async (name: string, email: string, password: string): Promise<any> => {
    const account = new Account(client);
    try {
        const response = await account.create(ID.unique(), email, password, name);
        console.log("Registration successful:", response);
        return response;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

export const getUserSaved = async (userId: string): Promise<any> => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_2,
            [
                Query.equal("userId", userId)
            ]
        );
        // Return the first matching document if available, or undefined.
        return result.documents.length > 0 ? result.documents[0] : undefined;
    } catch (error) {
        console.error("Error fetching user document:", error);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    const account = new Account(client);
    try {
      await account.deleteSession('current');
      await AsyncStorage.removeItem('session');
      console.log("Logged out and session cleared.");
    } catch (error) {
      console.error("Error cancelling session:", error);
      throw error;
    }
  };

export const clearSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('session');
    console.log('Session cleared successfully.');
  } catch (error) {
    console.error('Error clearing cached session:', error);
  }
};