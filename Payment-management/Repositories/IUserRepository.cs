// Repository/IUserDepartmentRepository.cs
using System.Threading.Tasks;
using UserService.Dto;
using UserService.Dtos;
using UserService.Models;
using YourNamespace.Dtos;

namespace UserService.Repository
{
    public interface IUserRepository
    {


        // Task CallUserCreationFunctionAsync(UserDto dto); // (optional if you’re using stored procedures)
        //Task<User?> GetByUsernameAsync(string username);
        //Task AddUserAsync(User user);
        // Task<User?> ValidateUserAsync(string username, string password);

        Task<string> CreateSuperUserAsync(UserDto dto);
        Task<SuperUserLoginResultDto> LoginSuperUserAsync(UserLoginDto dto);

        Task<IEnumerable<UserTypeDto>> GetAllUserTypesAsync();
        Task CallCreateDepartmentFunctionAsync(DepartmentDesignationDto dto);
        // Task<List<string>> GetAllDepartmentsAsync();
        Task<List<DepartmentDesignationDto>> GetAllDepartmentDesignationsAsync();
        Task DeleteDepartmentAsync(string deptName);
        Task DeleteDesignationAsync(string designationName);
        Task<String> CreateUserAsync(UserCreationDto dto);
        Task CallCreateModuleScreenFunctionAsync(ModuleWithScreensDto dto);
        Task<CombinedDetailsDto> GetAllCombinedDetailsAsync();
        Task<string> CheckUserLoginAsync(employeeLoginDto dto);
        ClientInfoDto GetClientInfo(HttpRequest request, ConnectionInfo connection);

        Task InsertAuditTrailAsync(AuditTrailDto dto);
    }
}
