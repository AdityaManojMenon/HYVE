import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from model import recommend_locations

# Set page configuration
st.set_page_config(
    page_title="Ideal Living Location Finder",
    page_icon="🏙️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for dark theme and styling
st.markdown("""
<style>
    /* Dark theme color palette */
    :root {
        --background-color: #0E1117;
        --secondary-background-color: #1B1F27;
        --primary-color: #4D96FF;
        --text-color: #F9F9F9;
        --accent-color: #6CD4FF;
    }
    
    /* Header styling */
    .main-header {
        color: var(--accent-color);
        font-size: 36px !important;
        font-weight: 700;
        margin-bottom: 20px;
        text-align: center;
    }
    
    .sub-header {
        color: var(--text-color);
        font-size: 24px;
        margin-bottom: 10px;
        text-align: center;
    }
    
    /* Card styling */
    .card {
        background-color: var(--secondary-background-color);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        border-left: 4px solid var(--primary-color);
    }
    
    .metric-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    
    .metric-label {
        color: #AAA;
        font-size: 14px;
    }
    
    .metric-value {
        color: var(--text-color);
        font-size: 18px;
        font-weight: bold;
    }
    
    .rank-indicator {
        font-size: 28px;
        font-weight: bold;
        color: var(--primary-color);
        float: right;
    }
    
    /* Form container */
    .form-container {
        background-color: var(--secondary-background-color);
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 30px;
    }
    
    /* Make sliders wider */
    .stSlider {
        width: 100% !important;
    }
    
    /* Footer */
    .footer {
        text-align: center;
        color: #888;
        font-size: 12px;
        margin-top: 30px;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Header
    st.markdown('<h1 class="main-header">Ideal Living Location Finder</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Find your perfect place based on rent budget and job opportunities</p>', unsafe_allow_html=True)
    
    # Create a form container for the inputs
    st.markdown('<div class="form-container">', unsafe_allow_html=True)
    
    # Two column layout for the form
    col1, col2 = st.columns(2)
    
    with col1:
        # Input for rent budget
        rent_budget = st.number_input(
            "Monthly Rent Budget ($)", 
            min_value=500, 
            max_value=10000, 
            value=2000,
            step=100
        )
    
    with col2:
        # Input for job title
        job_title = st.text_input(
            "Job Title You're Looking For",
            value="Data Scientist"
        )
    
    # Advanced options in an expander
    with st.expander("Advanced Options"):
        # Two column layout for advanced options
        adv_col1, adv_col2 = st.columns(2)
        
        with adv_col1:
            # Slider for rent importance
            rent_weight = st.slider(
                "Importance of Rent Match", 
                min_value=0.0, 
                max_value=1.0, 
                value=0.5, 
                step=0.01,
                help="Higher value gives more importance to locations with rent closer to your budget"
            )
        
        with adv_col2:
            # Slider for job importance
            job_weight = st.slider(
                "Importance of Job Opportunities", 
                min_value=0.0, 
                max_value=1.0, 
                value=0.5, 
                step=0.01,
                help="Higher value gives more importance to locations with more job opportunities"
            )
        
        # Budget threshold slider
        budget_threshold = st.slider(
            "Budget Flexibility (%)", 
            min_value=0.05, 
            max_value=0.5, 
            value=0.3, 
            step=0.05,
            help="How much above or below your budget to consider (as a percentage)"
        )
    
    # Button to find locations
    find_button = st.button("Find Ideal Locations", type="primary", use_container_width=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # When button is clicked, find recommendations
    if find_button:
        with st.spinner("Finding your ideal locations..."):
            # Get recommendations from the model
            recommendations = recommend_locations(
                rent_budget=rent_budget,
                job_title=job_title,
                rent_weight=rent_weight,
                job_weight=job_weight,
                budget_threshold=budget_threshold
            )
            
            if len(recommendations) > 0:
                # Format the rent as currency
                recommendations['formatted_rent'] = recommendations['avg_rent'].apply(lambda x: f"${x:,.2f}")
                
                # Format the scores as percentages
                recommendations['score_percentage'] = (recommendations['total_score'] * 100).round(1).astype(str) + '%'
                
                # Success message
                st.success(f"Found {len(recommendations)} locations that match your criteria!")
                
                # Display results section
                st.markdown("<h2 style='text-align: center; margin-top: 20px;'>Top Recommended Locations</h2>", 
                           unsafe_allow_html=True)
                
                # Create columns for visualization and results
                viz_col, data_col = st.columns([2, 1])
                
                with viz_col:
                    # Create bar chart for overall scores
                    fig = px.bar(
                        recommendations,
                        x='City',
                        y='total_score',
                        color='total_score',
                        color_continuous_scale='Viridis',
                        labels={'total_score': 'Match Score', 'City': 'Location'},
                        title=f'Top Locations Matching Your Criteria',
                        height=400
                    )
                    
                    # Customize the layout for dark theme
                    fig.update_layout(
                        plot_bgcolor='rgba(0,0,0,0)',
                        paper_bgcolor='rgba(0,0,0,0)',
                        font_color='white',
                        xaxis_title='Location',
                        yaxis_title='Match Score',
                        coloraxis_showscale=False
                    )
                    
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Create a second chart showing rent vs job count
                    fig2 = go.Figure()
                    
                    # Add scatter plot for rent and job count
                    fig2.add_trace(go.Scatter(
                        x=recommendations['City'],
                        y=recommendations['avg_rent'],
                        mode='markers',
                        name='Average Rent',
                        marker=dict(
                            size=recommendations['job_count'] + 10,  # Size based on job count
                            color=recommendations['total_score'],
                            colorscale='Viridis',
                            showscale=True,
                            colorbar=dict(title='Match Score')
                        ),
                        text=[f"Job Count: {count}" for count in recommendations['job_count']],
                        hovertemplate='<b>%{x}</b><br>Rent: $%{y:,.2f}<br>%{text}<extra></extra>'
                    ))
                    
                    # Add a horizontal line for budget
                    fig2.add_shape(
                        type="line",
                        x0=-0.5,
                        y0=rent_budget,
                        x1=len(recommendations) - 0.5,
                        y1=rent_budget,
                        line=dict(
                            color="red",
                            width=2,
                            dash="dash",
                        )
                    )
                    
                    # Add annotation for budget line
                    fig2.add_annotation(
                        x=len(recommendations) - 0.5,
                        y=rent_budget,
                        text=f"Your Budget: ${rent_budget:,.2f}",
                        showarrow=True,
                        arrowhead=1,
                        ax=50,
                        ay=-30,
                        font=dict(color="white")
                    )
                    
                    # Customize layout
                    fig2.update_layout(
                        title="Rent vs Job Opportunities (bubble size = job count)",
                        xaxis_title="Location",
                        yaxis_title="Average Monthly Rent ($)",
                        plot_bgcolor='rgba(0,0,0,0)',
                        paper_bgcolor='rgba(0,0,0,0)',
                        font_color='white',
                        height=400
                    )
                    
                    st.plotly_chart(fig2, use_container_width=True)
                
                with data_col:
                    st.markdown("<h3 style='text-align: center; margin-bottom: 20px;'>Location Details</h3>", 
                               unsafe_allow_html=True)
                    
                    # Display each location as a card
                    for i, (_, row) in enumerate(recommendations.iterrows()):
                        st.markdown(f"""
                        <div class="card">
                            <div class="rank-indicator">#{i+1}</div>
                            <h3>{row['City']}, {row['State']}</h3>
                            
                            <div class="metric-container">
                                <span class="metric-label">Average Rent:</span>
                                <span class="metric-value">${row['avg_rent']:,.2f}</span>
                            </div>
                            
                            <div class="metric-container">
                                <span class="metric-label">Job Opportunities:</span>
                                <span class="metric-value">{row['job_count']}</span>
                            </div>
                            
                            <div class="metric-container">
                                <span class="metric-label">Match Score:</span>
                                <span class="metric-value">{row['score_percentage']}</span>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
            else:
                st.error("No locations found that match your criteria. Try adjusting your budget or increasing the budget threshold.")
    
    # Footer
    st.markdown('<div class="footer">Powered by HYVE Location Recommendation System</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main() 