require "bima-http"
require "bima-doorkeeper-client"
require "json"
require "sinatra/base"
require "sinatra/reloader"
require "pry"

APP_NAME = "notifications_test_app"
ACCESS_ID = "notifications_test_app"
SECRET_KEY = "wHYTfmXpeaRUYOS92aDIhOFnEPzbJ7p5eC3DW1h5/VFkmNTnCHGCrjtT1ToaHmYgz/C5ieiLeM8xVIaXIQExhw=="

class App < Sinatra::Application
  # enable :sessions
  use Rack::Session::Pool, :expire_after => 2592000

  before "/*" do
    BimaHttp.configure do |config|
      config.apps = {
        "doorkeeper" => {
          "url" => "http://localhost:3000",
          "access_id" => "dk",
          "secret_key" => "secret"
        }
      }

      config.apps[APP_NAME] = {
        "url" => "http://localhost:3000",
        "access_id" => ACCESS_ID,
        "secret_key" => SECRET_KEY
      }
    end

    Doorkeeper.configure { |config| config.client_app_name = APP_NAME }
  end

  get "/Users/*" do
    file_subpath = params["splat"].first
    filepath = "/Users/" + file_subpath

    if filepath == js_sdk_file
      send_file(js_sdk_file)
    else
      halt 404, "File not found"
    end
  end

  get "/" do
    if params["client_authorization_token"].present?
      session[:session_token] = get_session_token
      session[:service_token] = get_service_token
      redirect "/"
    end

    @js_sdk_version = js_sdk_version
    @js_sdk_file = js_sdk_file

    if session[:session_token] && session[:service_token]
      session[:user_id] = get_session_user_id

      @socket_url = "ws://localhost:5000/socket"
      @access_id = "js_sdk_test_app"

      erb :index, :layout => :layout
    else
      @login_url = BimaHttp.apps["doorkeeper"]["url"] + "?app_name="
      @login_url += APP_NAME

      erb :no_session_index, :layout => false
    end
  end

  post "/logout" do
    begin
      session_token = session[:session_token]
      path = "api/sessions/logout"
      url = File.join(BimaHttp.apps["doorkeeper"]["url"], path)
      response = BimaHttp.post(
        url,
        {
          :params => { :session_token => session_token },
          :headers => { :accept => :json },
          :app_name => APP_NAME
        }
      )
    rescue => e
    ensure
      session[:session_token] = nil
      session[:service_token] = nil
      session[:user_id] = nil

      redirect "/"
    end
  end

  private

  def get_session_token
    authorization_token = params["client_authorization_token"]
    path = "/api/sessions/session_token"
    url = File.join(BimaHttp.apps["doorkeeper"]["url"], path)

    response = BimaHttp.post(
      url,
      {
        :params => { :client_authorization_token => authorization_token },
        :headers => { :accept => :json },
        :app_name => APP_NAME
      }
    )

    JSON.parse(response.body)["data"]["attributes"]["jwt"]
  rescue => e
    nil
  end

  def get_service_token
    if session[:session_token]
      session_token = session[:session_token]
      path = "/api/sessions/service_token"
      url = File.join(BimaHttp.apps["doorkeeper"]["url"], path)

      response = BimaHttp.post(
        url,
        {
          :params => { :session_token => session_token },
          :headers => { :accept => :json },
          :app_name => APP_NAME
        }
      )

      JSON.parse(response.body)["data"]["attributes"]["jwt"]
    end
  rescue => e
    nil
  end

  def get_session_user_id
    service_token = session[:service_token]
    path = "/api/sessions/user"
    url = File.join(BimaHttp.apps["doorkeeper"]["url"], path)

    response = BimaHttp.get(
      url,
      {
        :params => { :service_token => service_token },
        :headers => { :accept => :json },
        :app_name => APP_NAME
      }
    )

    JSON.parse(response.body)["data"]["id"]
  end

  def js_sdk_file
    path = "../../dist/#{js_sdk_version}/bima-notifications-sdk.js"
    File.expand_path(path ,File.dirname(__FILE__))
  end

  def js_sdk_version
    path = "../../package.json"
    package_file = File.expand_path(path ,File.dirname(__FILE__))
    data = JSON.parse(File.read(package_file)) || {}
    data["version"]
  end
end
