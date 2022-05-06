using cbs.wanderOn.Configuration;
using cbs.wanderOn.Controllers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddTransient<IMapService, FileMapService>();

builder.Services.AddSwaggerGen();

builder.Services.Configure<ProfileConfig>(builder.Configuration.GetSection(ProfileConfig.Profiles));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllers();

app.MapFallbackToFile("index.html");;

app.Run();
