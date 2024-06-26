import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed } from "react-icons/fa";

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition:shadow overflow-hidden rounded-lg w-full sm:w-[320px]">
      <Link to={`/listing/${listing._id}`}>
        {/* Listing Image */}
        <img
          src={listing.imageUrls[0]}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition:scale duration-300"
        />

        {/* Listing Name */}
        <div className="p-3 flex flex-col gap-2">
          <p className="truncate text-lg font-bold text-slate-700">
            {listing.name}
          </p>

          {/* Listing Address */}
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>

          {/* Listing Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>

          {/* Listing Price */}
          <p className="text-slate-500 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountedPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>

          {/* Bedrooms and Bathrooms */}
          <div className="text-slate-700 flex gap-4 items-center">
            <div className="font-bold text-sm flex items-center gap-1">
              <FaBed />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-sm flex items-start gap-1">
              <FaBath />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
