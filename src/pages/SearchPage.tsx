import { useSearchRestaurantes } from "@/api/RestauranteApi";
import CuisinesFilter from "@/components/CuisinesFilter";
import LoadingButton from "@/components/LoadingButton";
import PaginationSelector from "@/components/Search/PaginationSelector";
import type {SearchForm} from '@/components/Search/SearchBar'
import SortOptionsDropdown from "@/components/Search/SortOptionsDropdown";
import SearchBar from "@/components/Search/SearchBar";
import SearchResultCard from "@/components/Search/SearchResultCard";
import SearchResultsInfo from "@/components/Search/SearchResultsInfo";
import { useState } from "react";
import { useParams } from "react-router"

export type SearchState ={
    searchQuery: string;
    page: number;
    selectedCuisines: string[];
    sortOptions: string;
}

export default function SearchPage() {
    const { city } = useParams();
    const [searchState, setSearchState] = useState<SearchState>({searchQuery:"",page: 1,selectedCuisines:[],sortOptions: "bestMatch"});
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const {data:results, isLoading} = useSearchRestaurantes(searchState, city);

    // funcion setSortOptions
    const setSortOptions = (sortOptions: string)=>{
        setSearchState( (prevState)=> ({
            ...prevState,
            sortOptions,
            page: 1
        }))
    }// fin setsortoptiosn

    const setPage = (page:number)=>{
        setSearchState((prevState)=> ({
            ...prevState,
            page
        }))
    }// fin de setPage

    const setSelectedCuisines = (selectedCuisines: string[])=>{
        setSearchState( (prevstate)=>({
            ...prevstate,
            selectedCuisines,
            page:1
        }))
    }// fin de setSelectedCuisines

    const setSearchQuery = (searchFormData: SearchForm)=>{
        setSearchState ( (prevState)=>({
            ...prevState,
            searchQuery: searchFormData.searchQuery,
            page: 1
        }))
    } //Fin de setSearchQuery

    const resetSearch = () => {
        setSearchState( (prevstate) => ({
            ...prevstate,
            searchQuery: ""
        }))
    }// fin de resetSearch

    if(isLoading)
        <LoadingButton/>

    if(!results?.data || !city){
        return <span>!No hay resultados!</span>
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            <div id='cuisines_list'>
                <CuisinesFilter
                    selectedCuisines={searchState.selectedCuisines}
                    onChange={setSelectedCuisines}
                    onExpandedClick={()=> setIsExpanded((prevIsExpanded)=> !prevIsExpanded)}
                    isExpanded={isExpanded}
                />
            </div>
            <div id="main-content"
                className="flex flex-col gap5">
                    <SearchBar
                            searchQuery={searchState.searchQuery}
                            onSubmit={setSearchQuery}
                            placeHolder="Busqueda por cocina o nombre del restaurante"
                            onReset={resetSearch} 
                    />
                    <div className="flex justify-between flex-col gap-3 lg:flex-row">
                        <SearchResultsInfo
                        total={results.pagination.total}
                        city={city as string}
                        />
                    <SortOptionsDropdown
                        sortOptions={searchState.sortOptions}
                        onChange={(value)=>setSortOptions(value)}
                    />
                    </div>
                    {
                        results.data.map((restaurante, key)=> (
                            <SearchResultCard restaurante={restaurante} key={key}/>
                        ))  
                    }
                    <PaginationSelector
                        page={results.pagination.page}
                        pages={results.pagination.pages}
                        onPageChange={setPage}
                    />
                </div>
        </div>
    )
}