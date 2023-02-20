import { navigate } from "gatsby"
import React, { useEffect } from "react"

export const NotFound = () => {
    useEffect(() => {
        navigate("/not-found")
    }, [])
    return <></>
}

export default NotFound
