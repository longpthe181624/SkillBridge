package com.skillbridge.dto.admin.response;

import java.util.List;

/**
 * User List Response DTO
 * Response DTO for paginated user list in Admin User List
 */
public class UserListResponseDTO {
    private List<UserResponseDTO> users;
    private PageInfo page;

    // Constructors
    public UserListResponseDTO() {
    }

    public UserListResponseDTO(List<UserResponseDTO> users, PageInfo page) {
        this.users = users;
        this.page = page;
    }

    // Getters and Setters
    public List<UserResponseDTO> getUsers() {
        return users;
    }

    public void setUsers(List<UserResponseDTO> users) {
        this.users = users;
    }

    public PageInfo getPage() {
        return page;
    }

    public void setPage(PageInfo page) {
        this.page = page;
    }

    /**
     * Page Information Inner Class
     */
    public static class PageInfo {
        private long total;
        private int totalPages;
        private int currentPage;
        private int pageSize;

        // Constructors
        public PageInfo() {
        }

        public PageInfo(long total, int totalPages, int currentPage, int pageSize) {
            this.total = total;
            this.totalPages = totalPages;
            this.currentPage = currentPage;
            this.pageSize = pageSize;
        }

        // Getters and Setters
        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }

        public int getCurrentPage() {
            return currentPage;
        }

        public void setCurrentPage(int currentPage) {
            this.currentPage = currentPage;
        }

        public int getPageSize() {
            return pageSize;
        }

        public void setPageSize(int pageSize) {
            this.pageSize = pageSize;
        }
    }
}

