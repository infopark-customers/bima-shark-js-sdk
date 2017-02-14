require "bima-http"
require "bima-doorkeeper-core"
require "json"
require "sinatra/base"
require "sinatra/reloader"
require "pry"

# ATTENTSION: These credentials need to be present in config/api_apps.yml in the
# bima-notifications app
APP_NAME = "notifications_test_app"
ACCESS_ID = "notifications_test_app"
SECRET_KEY = "wHYTfmXpeaRUYOS92aDIhOFnEPzbJ7p5eC3DW1h5/VFkmNTnCHGCrjtT1ToaHmYgz/C5ieiLeM8xVIaXIQExhw=="

class App < Sinatra::Application
  use Rack::Session::Pool, :expire_after => 2592000

  before "/*" do
    BimaHttp.configure do |config|
      config.apps = {
        "doorkeeper" => {
          "url" => "http://localhost:3000",
          "access_id" => "doorkeeper",
          "secret_key" => "doorkeeper"
        }
      }

      config.apps[APP_NAME] = {
        "url" => "http://localhost:5000",
        "access_id" => ACCESS_ID,
        "secret_key" => SECRET_KEY
      }
    end

    Doorkeeper.configure do |config|
      config.client_app_name = APP_NAME
      config.site = BimaHttp.apps["doorkeeper"]["url"]
    end
  end

  # TODO: This is a really bad hack, but Sinatra seems a  bit buggy here. Maybe
  # there is another way to get this working...
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
    response = BimaHttp.post(
      Doorkeeper.config.endpoints[:session_token],
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
      Doorkeeper::Token.create_service_token(session[:session_token]).jwt
    end
  rescue => e
    nil
  end

  def get_session_user_id
    Doorkeeper::User.
      authenticate_user(:service_token => session[:service_token]).
      id
  end

  def js_sdk_file
    path = "../../dist/#{js_sdk_version}/bima-notifications-sdk.js"
    File.expand_path(path, File.dirname(__FILE__))
  end

  def js_sdk_version
    path = "../../package.json"
    package_file = File.expand_path(path ,File.dirname(__FILE__))
    data = JSON.parse(File.read(package_file)) || {}
    data["version"]
  end
end
