// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using UserService.Dto;
using UserService.Dtos;
using UserService.Models;

namespace UserService.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

      
        public DbSet<Department> Departments { get; set; }
        public DbSet<Designation> Designations { get; set; }

        public DbSet<Module> Modules { get; set; }
        public DbSet<Screen> Screens { get; set; }
        public DbSet<StatusDetailDto> StatusDetailDtos { get; set; }
        public DbSet<ModuleWithScreensDto> ModuleDetailDtos { get; set; }
        //public DbSet<User> Users { get; set; }
        public DbSet<UserCreationResponse> UserCreationResponses { get; set; } = null!;
        public DbSet<SuperUser> SuperUsers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<SuperUser>().HasNoKey().ToView(null);
            modelBuilder.Entity<StatusDetailDto>().HasNoKey().ToView(null);
            modelBuilder.Entity<ModuleWithScreensDto>().HasNoKey().ToView(null);
            modelBuilder.Entity<DepartmentDesignationDto>().HasNoKey().ToView(null);
            modelBuilder.Entity<UserCreationResponse>().HasNoKey();
            modelBuilder.Entity<SuperUserLoginResultDto>().HasNoKey().ToView(null);
            modelBuilder.Entity<Department>(entity =>
            {
                entity.ToTable("tbl_Department", schema: "user_management");

                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("dept_id");
                entity.Property(e => e.DeptName).HasColumnName("dept_name");
            });

            modelBuilder.Entity<Designation>(entity =>
            {
                entity.ToTable("tbl_Designation", schema: "user_management");

                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("designation_id");
                entity.Property(e => e.DeptId).HasColumnName("dept_id");
                entity.Property(e => e.DesignationName).HasColumnName("designation_desc");
            });
            modelBuilder.Entity<SuperUser>(entity =>
            {
                entity.ToTable("tbl_super_users", schema: "user_management");
                entity.Property(e => e.Id).HasColumnName("user_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Age).HasColumnName("age");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.UserType).HasColumnName("user_type");
            });
        }
    }
}
