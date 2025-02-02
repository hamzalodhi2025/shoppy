import { useEffect, useState } from "react";
import Cards from "../components/layout/ui/Cards"
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Button1 } from "../components/layout/ui/Button";

function Shop() {
    const products = useSelector((state) => state.products);
    const categories = useSelector((state) => state.categories)
    const isLoading = useSelector((state) => state.isLoading);
    const isError = useSelector((state) => state.isError);

    const [filteredProducts, setFilteredProducts] = useState([])
    const [category, setCategory] = useState([])
    const [searchQuery, setSearchQuery] = useState("");

    let toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setCategory((prev) => [...prev, e.target.value]);
        }
    }

    const applyFilter = () => {
        let productsCopy = products.slice();

        if (searchQuery) {
            productsCopy = productsCopy.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                category.includes(item.category)
            );
        }

        setFilteredProducts(productsCopy);
    }

    const clearFilter = () => {
        document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = false;
        });
        setCategory([]);
        setSearchQuery("");
    }


    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    useEffect(() => {
        applyFilter();
    }, [category, searchQuery]);


    //` Is Loading 
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#383838]">
                <div className="text-center">
                    <ScaleLoader
                        color="#e97730"
                        loading={isLoading}
                        width={10}
                        height={100}
                    />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-[#e97730]">Loading...</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Please wait while we fetch the products</p>
                </div>
            </div>
        );
    }
    //` Is Error
    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#383838] px-4">
                <div className="text-center max-w-lg w-full bg-white dark:bg-[#2d2d2d] p-8 rounded-lg shadow-lg">
                    <div className="mb-6">
                        <svg className="mx-auto h-16 w-16 text-[#e97730]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-[#e97730] mb-4">
                        Oops! Something went wrong
                    </h2>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">
                        {isError.message || "We encountered an error while fetching the products. Please try again later."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#e97730] hover:bg-[#d16628] text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );

    }
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#383838]">
            <div className="container px-4 py-8 mx-auto">
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Filter Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white dark:bg-[#383838] p-4 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-[#e97730]">Filters</h2>
                                <Button1 onclick={clearFilter} text={"Clear Filters"} size={"fit"} />
                            </div>
                            <div className="space-y-4">
                                {/* Search Bar */}
                                <div>
                                    <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200">Search Products</h3>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full text-[#383838] dark:text-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#e97730] bg-transparent dark:focus:border-[#e97730]"
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        value={searchQuery}

                                    />
                                </div>
                                {/* Category Filter */}
                                <div>
                                    <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200">Category</h3>
                                    <div className="space-y-2">
                                        {categories.map((item, index) => {
                                            return (
                                                <label key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                                    <input onChange={toggleCategory} value={item} type="checkbox" className="checkbox border-orange-400 [--chkbg:#e97730] [--chkfg:white] checked:border[#e97730]" />
                                                    <span>{item}</span>
                                                </label>)
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:w-3/4">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-[#e97730]">
                                Total Products: {products.length}
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 justify-evenly">
                            {/* Product Card */}
                            {filteredProducts?.map(({ _id, name, price, description, photos, category }) => {
                                return <Cards key={_id} _id={_id} name={name} price={price} description={description} photos={photos} category={category} />
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop